"use client";

import Link from "next/link";
import { Gamepad } from "lucide-react";
import { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";

type Genre = {
  id: number;
  name: string;
  slug: string;
  image_background: string;
};

const GenresPage = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
        All Genres
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/games/${genre.slug}`}
            passHref
            className="group"
            onClick={() => handleGenreClick(genre.slug)}
          >
            <div
              className="relative flex flex-col items-center justify-center h-40 sm:h-48 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              style={{
                backgroundImage: `url(${genre.image_background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

              <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                <Gamepad className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-white group-hover:text-primary transition-colors duration-300" />
                <span className="text-base sm:text-lg font-medium text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {genre.name}
                </span>
              </div>

              {loadingGenre === genre.slug && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-t-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;