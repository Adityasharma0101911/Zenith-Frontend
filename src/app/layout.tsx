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

import GlobalCommandPalette from "@/components/GlobalCommandPalette";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply theme + dark mode before paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('zenith-theme');if(t)document.documentElement.setAttribute('data-theme',t);var m=localStorage.getItem('zenith-mode');if(m)document.documentElement.setAttribute('data-mode',m)})()` }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-m3-surface text-m3-on-surface`}
      >
        <div className="relative min-h-screen overflow-x-hidden">

          {/* page content on top of the surface */}
          <div className="relative z-10 min-h-screen">
            {children}
          </div>

          {/* collapsible sidebar navigation */}
          <Sidebar />

          {/* Idea #18: The Global Jarvis CMD+K Command Palette */}
          <GlobalCommandPalette />

          {/* toast notifications styled to match material 3 */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2500,
              style: {
                borderRadius: "16px",
                background: "rgb(var(--m3-inverse-surface))",
                color: "rgb(var(--m3-inverse-on-surface))",
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
