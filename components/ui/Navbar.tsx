"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { Menu, X, Home, User, Gamepad, List } from "lucide-react";
import { useState, useEffect } from "react";

type Genre = {
  id: number;
  name: string;
  slug: string;
};

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading } = useLoading();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/genres`
      );
      const data = await response.json();
      setGenres(data.data.reverse());
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchResultsShown = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg z-20">
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 flex justify-center md:justify-start">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => router.push("/")}
          />
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          <SearchBar onResultsShown={handleSearchResultsShown} />
        </div>

        <div className="flex-1 hidden md:flex justify-end items-center space-x-4">
          {loading || isLoading ? (
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

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-background/95 backdrop-blur-sm border-r border-border/50 shadow-lg z-10 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col space-y-4 mt-16">
          <div className="md:hidden">
            <SearchBar onResultsShown={handleSearchResultsShown} />
          </div>

          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 hover:bg-primary/10 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              <span className="text-sm font-medium">Home</span>
            </Button>
          </Link>

          {user && (
            <Link href="/profile" passHref>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-2 hover:bg-primary/10 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Profile</span>
              </Button>
            </Link>
          )}

          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Gamepad className="h-5 w-5 mr-2" />
              Genres
            </h2>
            <ul className="space-y-2">
              {genres.slice(0, 6).map((genre) => (
                <li key={genre.id}>
                  <Link href={`/games/${genre.slug}`} passHref>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 hover:bg-primary/10 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-sm">{genre.name}</span>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Link href="/genres" passHref>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 hover:bg-primary/10 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <List className="h-4 w-4" />
                <span className="text-sm">Show All</span>
              </Button>
            </Link>
          </div>

          {loading || isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          ) : user ? (
            <Button
              variant="outline"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                router.push("/login");
                setIsMobileMenuOpen(false);
              }}
              className="w-full justify-start px-4 py-2 bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
