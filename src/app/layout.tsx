// root layout with material design 3 surface system
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// collapsible left sidebar navigation
import Sidebar from "@/components/Sidebar";

// smooth toast notifications
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zenith",
  description: "AI-powered financial wellness guardian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-m3-surface`}
      >
        {/* material design 3 surface container */}
        <div className="relative min-h-screen overflow-hidden">

          {/* ambient tonal blob 1 - top left */}
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-m3-primary-container rounded-full opacity-20 blur-[100px] animate-pulse-slow pointer-events-none" />

          {/* ambient tonal blob 2 - bottom right */}
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-m3-tertiary-container rounded-full opacity-20 blur-[100px] animate-pulse-slow pointer-events-none" />

          {/* page content on top of the surface */}
          <div className="relative z-10">
            {children}
          </div>

          {/* collapsible sidebar navigation */}
          <Sidebar />

          {/* toast notifications styled to match material 3 */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
              style: {
                borderRadius: "16px",
                background: "#191C1B",
                color: "#E1E3E1",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
