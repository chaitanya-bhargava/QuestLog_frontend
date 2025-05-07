"use client";

import { useState, useEffect, useRef } from "react";
import GameCard from "@/components/ui/GameCard";
import { useLoading } from "@/context/LoadingContext";

type Game = {
  id: number;
  name: string;
  background_image: string;
  genres: { name: string }[];
  released: string;
};

type GenrePageClientProps = {
  initialData: {
    data: Game[];
    total: number;
  };
  genre: string;
};

const Loader = () => (
  <div className="flex justify-center mt-4">
    <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

const GenrePageClient = ({ initialData, genre }: GenrePageClientProps) => {
  const [games, setGames] = useState<Game[]>(initialData.data);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const { setLoadingGenre } = useLoading();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMoreGames = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    pageRef.current += 1;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/games?genre=${genre}&page=${pageRef.current}`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setGames((prevGames) => [...prevGames, ...data.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const bottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200;
        if (bottom && hasMore) {
          fetchMoreGames();
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    setLoadingGenre(null);
  }, [setLoadingGenre]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm p-4 md:p-8 flex flex-col items-start">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold capitalize mb-6 md:mb-8 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {genre == "role-playing-games-rpg"
          ? "RPG"
          : genre == "board-games"
          ? "Board Games"
          : genre == "massively-multiplayer"
          ? "Massively Multiplayer"
          : genre}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={{
              id: game.id,
              name: game.name,
              image:
                game.background_image == ""
                  ? "https://github.com/shadcn.png"
                  : game.background_image,
              genres: game.genres,
              release_date: game.released,
            }}
            updateGameShelfStatus={() => {}}
          />
        ))}
      </div>

      {loading && <Loader />}

      {!hasMore && !loading && (
        <div className="flex justify-center mt-6 md:mt-8">
          <span className="text-sm md:text-base text-muted-foreground">
            No more games to load.
          </span>
        </div>
      )}
    </div>
  );
};

export default GenrePageClient;