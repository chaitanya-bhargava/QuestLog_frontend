"use client";

import Link from "next/link";
import { Button } from "./button";
import { Home, User, Gamepad, List } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";

type Genre = {
  id: number;
  name: string;
  slug: string;
};

const Sidebar = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const { loadingGenre, setLoadingGenre } = useLoading();

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/genres`);
      const data = await response.json();
      setGenres(data.data.reverse());
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreSlug: string) => {
    setLoadingGenre(genreSlug);
  };

  return (
    <div className="hidden md:flex fixed top-0 left-0 w-64 h-screen bg-background/95 backdrop-blur-sm border-r border-border/50 shadow-lg p-6 flex-col space-y-4 mt-24">
      <Link href="/" passHref>
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 hover:bg-primary/10 transition-colors duration-200"
        >
          <Home className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Home</span>
        </Button>
      </Link>

      <Link href="/profile" passHref>
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 hover:bg-primary/10 transition-colors duration-200"
        >
          <User className="h-5 w-5 mr-3" />
          <span className="text-sm font-medium">Profile</span>
        </Button>
      </Link>

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
                  onClick={() => handleGenreClick(genre.slug)}
                >
                  <span className="text-sm">{genre.name}</span>
                  {loadingGenre === genre.slug && (
                    <div className="ml-2 w-4 h-4 border-2 border-t-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                  )}
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
          >
            <List className="h-4 w-4" />
            <span className="text-sm">Show All</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;