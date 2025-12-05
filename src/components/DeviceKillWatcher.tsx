// app/components/DeviceKillWatcher.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type DeviceInfo = {
  deviceId: string;
  browserName?: string;
  killed?: boolean;
  lastSeen?: number;
  createdAt?: number;
};

export default function DeviceKillWatcher({
  devices,
}: {
  devices: DeviceInfo[];
}) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const deviceId = localStorage.getItem("deviceId");
    if (!deviceId) return;

    const current = devices.find((d) => d.deviceId === deviceId);

    if (current?.killed) {
      router.push("/forcedLoggedOut");
    }
  }, [devices, router]);

  return null; // nothing visual
}
