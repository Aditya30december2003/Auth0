// components/DeviceLimitGuard.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getOrCreateDeviceId } from "@/utils/deviceId";

type DeviceInfo = {
  deviceId: string;
  browserName: string;
  lastSeen: number;
  createdAt: number;
  killed?: boolean;
};

type RegisterResponse =
  | { status: "ok"; devices: DeviceInfo[] }
  | { status: "over_limit"; devices: DeviceInfo[]; maxDevices: number };

export default function DeviceLimitGuard() {
  const [overLimit, setOverLimit] = useState(false);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [maxDevices, setMaxDevices] = useState<number>(3);
  const [loadingKick, setLoadingKick] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const deviceId = getOrCreateDeviceId();
      if (!deviceId) return;

      const browserName =
        typeof navigator !== "undefined"
          ? navigator.userAgent
          : "unknown browser";

      try {
        const res = await axios.post<RegisterResponse>(
          "/api/devices/register",
          { deviceId, browserName }
        );

        if (res.data.status === "over_limit") {
          setOverLimit(true);
          setDevices(res.data.devices);
          setMaxDevices(res.data.maxDevices);
        }
        // TEMPORARY HACK: force popup always
        // setOverLimit(true);
        // setDevices([
        //   {
        //     deviceId: "TEST-DEVICE",
        //     browserName: "Fake browser",
        //     createdAt: Date.now(),
        //     lastSeen: Date.now(),
        //     killed: false,
        //   },
        // ]);
        // setMaxDevices(1);
      } catch (err) {
        console.error("Device register failed:", err);
      }
    };

    run();
  }, []);

  const handleCancelLogin = () => {
    window.location.href = "/auth/logout";
  };

  const handleForceLogout = async (deviceIdToKick: string) => {
    const currentDeviceId = localStorage.getItem("deviceId");
    if (!currentDeviceId) return;

    const currentBrowserName =
      typeof navigator !== "undefined"
        ? navigator.userAgent
        : "unknown browser";

    setLoadingKick(deviceIdToKick);

    try {
      await axios.post("/api/devices/force-logout", {
        deviceIdToKick,
        currentDeviceId,
        currentBrowserName,
      });

      // eslint-disable-next-line react-hooks/immutability
      window.location.href = "/profile";
    } catch (err) {
      console.error("Force logout failed:", err);
      setLoadingKick(null);
    }
  };

  // If within limit, render nothing
  if (!overLimit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/95 backdrop-blur-sm">
      <div 
        className="w-[90%] max-w-xl border-2 border-black bg-white text-black p-6 md:p-8"
        style={{
          boxShadow: `
            10px 10px 0 0 rgba(0, 0, 0, 1),
            inset 1px 1px 0 0 rgba(0, 0, 0, 0.1)
          `
        }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl mb-2 font-bold tracking-tight">
            Too many devices logged in
          </h2>
          <p className="text-gray-700">
            Your account is limited to{" "}
            <span className="font-semibold text-black">{maxDevices}</span> device
            {maxDevices > 1 ? "s" : ""}. Choose a device to log out, or cancel
            this login.
          </p>
        </div>

        {/* Devices List */}
        <div className="space-y-3 max-h-56 overflow-y-auto mb-6 pr-2">
          {devices.map((d) => (
            <div
              key={d.deviceId}
              className="flex items-center justify-between gap-3 border border-black bg-white px-4 py-3"
              style={{
                boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)"
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-black truncate max-w-[220px]">
                  {d.browserName || "Unknown device"}
                </div>
                <div className="text-xs text-gray-600 break-all mt-1">
                  ID: {d.deviceId}
                </div>
              </div>
              <button
                onClick={() => handleForceLogout(d.deviceId)}
                disabled={loadingKick === d.deviceId}
                className="whitespace-nowrap border border-black bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 transition-all duration-150"
                style={{
                  boxShadow: "3px 3px 0 0 rgba(0, 0, 0, 1)"
                }}
              >
                {loadingKick === d.deviceId ? "Logging out…" : "Log out"}
              </button>
            </div>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end">
          <button
            onClick={handleCancelLogin}
            className="border-2 border-black bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-gray-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150"
            style={{
              boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)"
            }}
          >
            Cancel this login
          </button>
        </div>

        {/* Decorative corner marks */}
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-300">
          <div className="flex space-x-2">
            <div className="w-2 h-2 border border-black bg-black"></div>
            <div className="w-2 h-2 border border-black"></div>
            <div className="w-2 h-2 border border-black"></div>
          </div>
          <div className="text-xs text-gray-500">
            {devices.length} of {maxDevices} devices
          </div>
        </div>
      </div>
    </div>
  );
}