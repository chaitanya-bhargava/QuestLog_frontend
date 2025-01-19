"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, loading, login, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg z-10">
      <div className="flex-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={()=>{
              router.push("/")
            }}
          />
      </div>

      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      <div className="flex-1 flex justify-end items-center space-x-4">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        ) : user ? (
          <div className="flex items-center space-x-4">
            <Link href="/profile" passHref>
              <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-200">
                <AvatarImage
                  src={user.avatar_url || "https://github.com/shadcn.png"}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button
              variant="outline"
              onClick={logout}
              className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            className="bg-primary hover:bg-primary/90 transition-colors duration-200"
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
