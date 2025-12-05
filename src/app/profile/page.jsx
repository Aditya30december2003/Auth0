// app/profile/page.tsx
import { auth0 } from "@/lib/auth0";
import axios from "axios";
import DeviceLimitGuard from "@/components/DeviceLimitGuard";
import LogoutButton from "@/components/LogoutButton";
import { FaUser, FaEnvelope, FaPhone, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";
import DeviceKillWatcher from '@/components/DeviceKillWatcher'

export default async function ProfilePage() {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
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
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* 👇 CLIENT components */}
      <DeviceLimitGuard />
      
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:w-2/3 mx-auto border-2">
          <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-500 mt-1">Your account information</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 text-white bg-black flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                {isEmailVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* Name */}
              <div className="border-4 text-white border-black pl-5 py-3 bg-black shadow-[5px_5px_0px_0px_rgba(255,255,255)]">
                <div className="flex items-center gap-3 mb-1">
                  <FaUser className="" />
                  <p className="text-sm font-medium uppercase tracking-wider">Full Name</p>
                </div>
                <p className="text-xl font-semibold">{fullName}</p>
              </div>

              {/* Email */}
              <div className="border-l-4 border-black pl-5 py-3 bg-black rounded-r-lg">
                <div className="flex items-center gap-3 mb-1">
                  <FaEnvelope className="text-white" />
                  <p className="text-sm font-medium text-white uppercase tracking-wider">Email Address</p>
                  {isEmailVerified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-lg font-medium text-white">{email}</p>
              </div>

              {/* Phone */}
              <div className="border-l-4 pl-5 py-3 text-white bg-black rounded-r-lg">
                <div className="flex items-center gap-3 mb-1">
                  <FaPhone className="" />
                  <p className="text-sm font-medium uppercase tracking-wider">Phone Number</p>
                </div>
                <p className={`text-lg font-medium ${phone === "(not set)" ? "text-gray-500 italic" : "text-white"}`}>
                  {phone}
                </p>
                {phone === "(not set)" && (
                  <p className="text-sm text-gray-400 mt-1">Add a phone number for better security</p>
                )}
              </div>

              {/* Last Login */}
              <div className="border-l-4 pl-5 py-3 bg-black text-white">
                <p className="text-sm font-medium uppercase tracking-wider mb-1">Last Login</p>
                <p className="">{lastLogin}</p>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Optional: DeviceKillWatcher can be rendered here if needed */}
      <DeviceKillWatcher devices={devices} />
    </div>
  );
}