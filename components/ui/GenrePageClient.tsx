"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import GameCard from "@/components/ui/GameCard";

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
  const router = useRouter();

  const fetchMoreGames = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    pageRef.current += 1;

    try {
      const response = await fetch(
        `http://localhost:8080/v1/games?genre=${genre}&page=${pageRef.current}`
      );
      const data = await response.json();

      if (data.data.length === 0) {
        setHasMore(false);
      } else {
        setGames((prevGames) => [...prevGames, ...data.data]);
      }
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (bottom) {
        fetchMoreGames();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize mb-4">
        {genre == "role-playing-games-rpg"
          ? "RPG"
          : genre == "board-games"
          ? "Board Games"
          : genre == "massively-multiplayer"
          ? "Massively Multiplayer"
          : genre}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={{
              id: game.id,
              name: game.name,
              image: game.background_image,
              genre: game.genres[0]?.name || "Unknown Genre",
              releaseDate: game.released,
            }}
          />
        ))}
      </div>
      {loading && <Loader />}
      {!hasMore && !loading && (
        <div className="flex justify-center mt-4">
          <span>No more games to load.</span>
        </div>
      )}
    </div>
  );
};

export default GenrePageClient;
