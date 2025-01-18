"use client"; // Mark this as a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Callback() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the OAuth code for a user session
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/google/callback`, {
          withCredentials: true,
        });
        if (response.data) {
          router.push("/dashboard"); // Redirect to the dashboard after login
        }
      } catch (error) {
        console.error("Callback failed:", error);
        router.push("/login"); // Redirect to login if there's an error
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p>Loading...</p>
    </div>
  );
}