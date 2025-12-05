"use client";

import Link from "next/link";

export default function LoginButton() {
  const loginUrl = `/auth/login?returnTo=/phone`;
  
  return (
      <Link
        href={loginUrl}
        className="border-2 w-full mx-auto text-black py-2 px-7 font-bold shadow-[5px_5px_0px_0px_rgba(0,0,0)] hover:shadow-none "
      >
        Log In
      </Link>
  );
}