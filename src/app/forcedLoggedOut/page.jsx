"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';

export default function ForcedLogout() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    // Clear device info
    localStorage.removeItem("deviceId");
    
    // Show toast notification
    toast.error("You were logged out from another device", {
      duration: 5000,
      icon: '⚠️',
      style: {
        background: '#fee2e2',
        color: '#991b1b',
        border: '2px solid #dc2626',
        boxShadow: '5px 5px 0px 0px rgba(220,38,38,0.3)',
      },
    });

    // Countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.loading("Redirecting to logout...");
          setTimeout(() => router.push("/auth/logout"), 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleLogoutNow = () => {
    toast.loading("Logging out...");
    setTimeout(() => router.push("/auth/logout"), 500);
  };

  const handleLoginAgain = () => {
    toast.loading("Redirecting to login...");
    setTimeout(() => router.push("/auth/login"), 500);
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            border: '2px solid #000',
            boxShadow: '5px 5px 0px 0px rgba(0,0,0)',
          },
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md">
          
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
                onClick={handleLogoutNow}
                className="w-full py-3 border-2 border-black bg-black text-white font-medium rounded-lg hover:bg-gray-900 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150"
                style={{
                  boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)"
                }}
              >
                Logout Now
              </button>
              
              <button
                onClick={handleLoginAgain}
                className="w-full py-3 border-2 border-black bg-white text-black font-medium rounded-lg hover:bg-gray-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-150"
                style={{
                  boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)"
                }}
              >
                Login Again
              </button>
            </div>

          </div>
         
        </div>
      </div>
    </>
  );
}