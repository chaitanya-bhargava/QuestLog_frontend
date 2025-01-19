"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="p-8 bg-background/90 backdrop-blur-sm rounded-lg shadow-xl border border-border/50 max-w-md w-full mx-4">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="cursor-pointer"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 text-primary">
          Welcome Back!
        </h1>

        <p className="text-muted-foreground text-center mb-8">
          Sign in to continue to your account.
        </p>

        <Button
          onClick={login}
          className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
          size="lg"
        >
          <Image
            src="/google-icon.png"
            alt="Google Icon"
            width={20}
            height={20}
            className="mr-2"
          />
          Login with Google
        </Button>
      </div>
    </div>
  );
}
