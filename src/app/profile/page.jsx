// app/profile/page.tsx
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import DeviceLimitGuard from "@/components/DeviceLimitGuard";
import LogoutButton from "@/components/LogoutButton";
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle } from "react-icons/fa";
import DeviceKillWatcher from '@/components/DeviceKillWatcher'
import { Toaster } from 'react-hot-toast';

export default async function ProfilePage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Toaster />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const domain = process.env.AUTH0_DOMAIN;
  const mgmtToken = process.env.API_TOKEN;

  const { data: freshUser } = await axios.get(
    `https://${domain}/api/v2/users/${encodeURIComponent(user.sub)}`,
    {
      headers: {
        Authorization: `Bearer ${mgmtToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const fullName = freshUser.name || freshUser.nickname || freshUser.email;
  const email = freshUser.email;
  const phone = freshUser.user_metadata?.phoneNumber ?? "(not set)";
  const devices = freshUser.user_metadata?.devices || [];
  const isEmailVerified = freshUser.email_verified;
  const lastLogin = freshUser.last_login ? new Date(freshUser.last_login).toLocaleDateString() : 'Never';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
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
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#1f2937',
            },
          },
        }}
      />
      
      <div className="w-full max-w-6xl">
        {/* 👇 CLIENT components */}
        <DeviceLimitGuard />
        
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left Column - Profile Card */}
          <div className="w-full lg:w-2/3 mx-auto">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:shadow-[0_8px_24px_rgba(0,0,0,0.08)] md:shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-8">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">Your account information</p>
                </div>
                <div className="relative self-center sm:self-auto">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 text-white bg-black flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {isEmailVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div className="border-2 sm:border-4 border-black pl-3 sm:pl-5 py-3 bg-black shadow-[3px_3px_0px_0px_rgba(255,255,255)] sm:shadow-[5px_5px_0px_0px_rgba(255,255,255)]">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    <FaUser className="text-sm sm:text-base text-white" />
                    <p className="text-xs sm:text-sm font-medium uppercase text-white tracking-wider">Full Name</p>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-white truncate">{fullName}</p>
                </div>

                {/* Email */}
                <div className="border-l-2 sm:border-l-4 border-black pl-3 sm:pl-5 py-3 bg-black rounded-r-lg">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-sm sm:text-base text-white" />
                      <p className="text-xs sm:text-sm font-medium text-white uppercase tracking-wider">Email Address</p>
                    </div>
                    {isEmailVerified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg font-medium text-white truncate">{email}</p>
                </div>

                {/* Phone */}
                <div className="border-l-2 sm:border-l-4 border-black pl-3 sm:pl-5 py-3 text-white bg-black rounded-r-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1">
                    <FaPhone className="text-sm sm:text-base" />
                    <p className="text-xs sm:text-sm font-medium uppercase tracking-wider">Phone Number</p>
                  </div>
                  <p className={`text-base sm:text-lg font-medium ${phone === "(not set)" ? "text-gray-300 italic" : "text-white"}`}>
                    {phone}
                  </p>
                  {phone === "(not set)" && (
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Add a phone number for better security</p>
                  )}
                </div>

                {/* Last Login */}
                <div className="border-l-2 sm:border-l-4 border-black pl-3 sm:pl-5 py-3 bg-black text-white">
                  <p className="text-xs sm:text-sm font-medium uppercase tracking-wider mb-1">Last Login</p>
                  <p className="text-base sm:text-lg">{lastLogin}</p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-100">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        <DeviceKillWatcher devices={devices} />
      </div>
    </div>
  );
}