"use client"; // Mark this as a Client Component

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button onClick={logout} variant="destructive">
      Logout
    </Button>
  );
}
