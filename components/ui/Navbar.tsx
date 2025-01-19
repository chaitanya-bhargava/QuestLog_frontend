"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import { Button } from "@/components/ui/button"; // Import the Button component from shadcn
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook

const Navbar = () => {
  const { user, loading, login, logout } = useAuth(); // Get auth state and methods

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-background shadow-sm z-10">
      <div className="flex-1">LOGO</div>

      <div className="flex-1 flex justify-center">
        <SearchBar /> {/* Use the SearchBar component here */}
      </div>

      <div className="flex-1 flex justify-end items-center space-x-4">
        {loading ? (
          // Show a loading spinner or placeholder while checking auth state
          <div>Loading...</div>
        ) : user ? (
          // If the user is logged in, show the profile avatar and logout button
          <div className="flex items-center space-x-4">
            <Link href="/profile" passHref>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={user.avatar_url || "https://github.com/shadcn.png"} // Use the user's avatar URL if available
                  alt="User Avatar"
                />
                <AvatarFallback>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          // If the user is logged out, show the login button
          <Button onClick={login}>Login with Google</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;