import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import { getManagementApiToken } from "@/lib/auth0Token";

type DeviceInfo = {
  deviceId: string;
  browserName: string;
  lastSeen: number;
  createdAt: number;
  killed?: boolean;
};

export async function POST(req: NextRequest) {
  
  const session = await auth0.getSession(req);

  if (!session?.user?.sub) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.sub;
  const body = await req.json();
  const deviceIdToKick = body.deviceIdToKick as string | undefined;
  const currentDeviceId = body.currentDeviceId as string | undefined;
  const currentBrowserName = body.currentBrowserName as string | undefined;

  if (!deviceIdToKick || !currentDeviceId || !currentBrowserName) {
    return NextResponse.json(
      {
        error:
          "deviceIdToKick, currentDeviceId, currentBrowserName are required",
      },
      { status: 400 }
    );
  }

  const domain = process.env.AUTH0_DOMAIN!;
  const mgmtToken = await getManagementApiToken()

  try {
    const { data: freshUser } = await axios.get(
      `https://${domain}/api/v2/users/${encodeURIComponent(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    let devices: DeviceInfo[] = freshUser.user_metadata?.devices || [];
    const now = Date.now();

    
    devices = devices.map((d) =>
      d.deviceId === deviceIdToKick ? { ...d, killed: true } : d
    );

    const idxCurrent = devices.findIndex(
      (d) => d.deviceId === currentDeviceId
    );

    if (idxCurrent === -1) {
      devices.push({
        deviceId: currentDeviceId,
        browserName: currentBrowserName,
        createdAt: now,
        lastSeen: now,
        killed: false,
      });
    } else {
      devices[idxCurrent] = {
        ...devices[idxCurrent],
        browserName: currentBrowserName,
        lastSeen: now,
        killed: false,
      };
    }

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
      "force-logout devices error:",
      err?.response?.data || err.message
    );
    return NextResponse.json(
      { error: "Failed to update devices" },
      { status: 500 }
    );
  }
}
