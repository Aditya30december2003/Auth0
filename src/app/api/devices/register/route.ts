// app/api/devices/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import axios from "axios";

type DeviceInfo = {
  deviceId: string;
  browserName: string;
  lastSeen: number;
  createdAt: number;
  killed?: boolean;
};

// For the assignment: N = 3
const N = 1;

export async function POST(req: NextRequest) {
  const session = await auth0.getSession(req);

  if (!session?.user?.sub) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.sub;
  const body = await req.json();
  const deviceId = body.deviceId as string | undefined;
  const browserName = body.browserName as string | undefined;

  if (!deviceId || !browserName) {
    return NextResponse.json(
      { error: "deviceId and browserName are required" },
      { status: 400 }
    );
  }

  const rawDomain = process.env.AUTH0_DOMAIN;
  const mgmtToken = process.env.API_TOKEN;

  if (!rawDomain || !mgmtToken) {
    console.error("Missing AUTH0_DOMAIN or API_TOKEN");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const domain = rawDomain.replace("https://", "");

  try {
    // 1️⃣ Fetch fresh user with metadata
    const { data: freshUser } = await axios.get(
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const devices: DeviceInfo[] = freshUser.user_metadata?.devices || [];
    const now = Date.now();

    const idx = devices.findIndex((d) => d.deviceId === deviceId);
    const activeDevices = devices.filter((d) => !d.killed);

    const returnOverLimit = () =>
      NextResponse.json(
        {
          status: "over_limit" as const,
          devices: activeDevices,
          maxDevices: N,
        },
        { status: 200 }
      );

    // 2️⃣ Device already known
    if (idx !== -1) {
      const existing = devices[idx];

      // 2.a Already active → just refresh and allow
      if (!existing.killed) {
        devices[idx] = {
          ...existing,
          browserName,
          lastSeen: now,
        };

        await axios.patch(
          `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
          {
            user_metadata: {
              ...freshUser.user_metadata,
              devices,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${mgmtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        return NextResponse.json({ status: "ok", devices }, { status: 200 });
      }

      // 2.b Previously KILLED device trying to log in again
      const activeWithoutThis = devices.filter(
        (d) => !d.killed && d.deviceId !== deviceId
      );

      // If there are already N other active devices → over limit again
      if (activeWithoutThis.length >= N) {
        return returnOverLimit();
      }

      // Otherwise: free slot available → REVIVE this device
      devices[idx] = {
        ...existing,
        browserName,
        lastSeen: now,
        killed: false,
      };

      await axios.patch(
        `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
        {
          user_metadata: {
            ...freshUser.user_metadata,
            devices,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${mgmtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return NextResponse.json({ status: "ok", devices }, { status: 200 });
    }

    // 3️⃣ Completely NEW device
    if (activeDevices.length >= N) {
      return returnOverLimit();
    }

    const newDevice: DeviceInfo = {
      deviceId,
      browserName,
      createdAt: now,
      lastSeen: now,
      killed: false,
    };

    devices.push(newDevice);

    await axios.patch(
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        user_metadata: {
          ...freshUser.user_metadata,
          devices,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ status: "ok", devices }, { status: 200 });
  } catch (err: any) {
    console.error(
      "register devices error:",
      err?.response?.data || err.message
    );
    return NextResponse.json(
      { error: "Failed to register device" },
      { status: 500 }
    );
  }
}
