import Link from "next/link";
import { Gamepad } from "lucide-react";

async function getGenres(): Promise<Genre[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/genres`);
  const data = await response.json();
  return data.data;
}

type Genre = {
  id: number;
  name: string;
  slug: string;
  image_background: string;
};

const GenresPage = async () => {
  const genres = (await getGenres()).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">All Genres</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/games/${genre.slug}`}
            passHref
            className="group"
          >
            <div
              className="relative flex flex-col items-center justify-center h-48 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              style={{
                backgroundImage: `url(${genre.image_background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                <Gamepad className="h-8 w-8 mb-2 text-white group-hover:text-primary transition-colors duration-300" />
                <span className="text-lg font-medium text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {genre.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
