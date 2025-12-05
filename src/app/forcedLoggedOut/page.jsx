// app/forcedLoggedOut/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForcedLogout() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Clear device info
    localStorage.removeItem("deviceId");

    // Countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/auth/logout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-black flex items-center justify-center animate-pulse">
            <svg
              className="w-10 h-10 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
        </div>

        {/* Main content - Pencil drawing effect */}
        <div 
          className="bg-white rounded-xl border-2 border-black p-8 text-center"
          style={{
            boxShadow: `
              8px 8px 0 0 rgba(0, 0, 0, 1),
              inset 1px 1px 0 0 rgba(0, 0, 0, 0.1)
            `
          }}
        >
          <h1 className="text-2xl font-bold text-black mb-3 tracking-tight">
            You were logged out
          </h1>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Your session was terminated because another device forced a logout.
          </p>

          {/* Countdown */}
          <div className="mb-8">
            <div 
              className="inline-flex items-center justify-center px-4 py-2 border border-black bg-white rounded-lg mb-3"
              style={{
                boxShadow: "3px 3px 0 0 rgba(0, 0, 0, 1)"
              }}
            >
              <span className="text-lg font-semibold text-black">
                Redirecting in {countdown}
              </span>
            </div>
            <div 
              className="w-full h-2 border border-black bg-white rounded-full overflow-hidden"
              style={{
                boxShadow: "inset 2px 2px 0 0 rgba(0, 0, 0, 0.2)"
              }}
            >
              <div 
                className="h-full bg-black transition-all duration-1000 ease-out"
                style={{ width: `${(30 - countdown) / 30 * 100}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/auth/logout")}
              className="w-full py-3 border-2 border-black bg-black text-white font-medium rounded-lg hover:bg-gray-900 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150"
              style={{
                boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)"
              }}
            >
              Logout Now
            </button>
            
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full py-3 border-2 border-black bg-white text-black font-medium rounded-lg hover:bg-gray-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150"
              style={{
                boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)"
              }}
            >
              Login Again
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-6 italic">
            This is usually done when you log in from a new device
          </p>
        </div>

        {/* Decorative border corners */}
        <div className="flex justify-between mt-2 px-1">
          <div className="w-3 h-3 border-t-2 border-l-2 border-black"></div>
          <div className="w-3 h-3 border-t-2 border-r-2 border-black"></div>
        </div>
      </div>
    </div>
  );
}