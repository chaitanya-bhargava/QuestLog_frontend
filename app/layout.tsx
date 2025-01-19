import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quest Log",
  description: "One stop destination to find and track your favourite video games.",
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
        <AuthProvider>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-4 ml-64 mt-16">
            <Navbar />
            {children}
            {/* <ThemeToggleButton/> */}
          </div>
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}
