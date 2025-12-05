import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Auth0 Next.js App",
  description: "Next.js app with Auth0 authentication",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* heading */}
      <Navbar/> 
        <Auth0Provider>
          {children}
        </Auth0Provider>
      <Footer/>
      </body>
    </html>
  );
}