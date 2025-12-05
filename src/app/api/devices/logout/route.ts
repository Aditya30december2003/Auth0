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
  const currentDeviceId = body.currentDeviceId as string | undefined;

  if (!currentDeviceId) {
    return NextResponse.json(
      { error: "currentDeviceId is required" },
      { status: 400 }
    );
  }

  const rawDomain = process.env.AUTH0_DOMAIN!;
  const domain = rawDomain.replace("https://", "");
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

    
    devices = devices.map((d) =>
      d.deviceId === currentDeviceId ? { ...d, killed: true } : d
    );

    

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

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err: any) {
    console.error(
      "logout devices error:",
      err?.response?.data || err.message
    );
    return NextResponse.json(
      { error: "Failed to logout device" },
      { status: 500 }
    );
  }
}
