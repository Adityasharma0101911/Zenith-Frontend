// this creates the calming background gradient and blobs
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// import the floating navbar
import Navbar from "@/components/Navbar";

// this adds smooth toast notifications
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* main wrapper with calming gradient background */}
        <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 overflow-hidden">

          {/* background blob 1 - light teal breathing circle */}
          <div className="absolute top-20 -left-40 w-96 h-96 bg-teal-200 rounded-full opacity-40 blur-3xl animate-pulse-slow" />

          {/* background blob 2 - light blue breathing circle */}
          <div className="absolute bottom-20 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-40 blur-3xl animate-pulse-slow" />

          {/* the page content sits on top of the blobs */}
          <div className="relative z-10">
            {children}
          </div>

          {/* the floating navbar at the bottom */}
          <Navbar />

          {/* this renders toast notifications */}
          <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
        </div>
      </body>
    </html>
  );
}
