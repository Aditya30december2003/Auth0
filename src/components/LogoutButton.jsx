// "use client";
"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const deviceId =
        typeof window !== "undefined"
          ? localStorage.getItem("deviceId")
          : null;

      if (deviceId) {
        await fetch("/api/devices/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentDeviceId: deviceId }),
        }).catch((err) => console.error("device logout failed:", err));
      }
    } finally {
      // Always log out from Auth0 even if metadata update fails
      window.location.href = "/auth/logout";
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="block w-full text-center px-4 py-2 bg-black text-white transition disabled:opacity-60"
    >
      {loading ? "Logging out..." : "LOG OUT"}
    </button>
  );
}
