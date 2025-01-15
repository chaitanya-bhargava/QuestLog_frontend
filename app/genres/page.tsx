import { Button } from "@/components/ui/button";
import Link from "next/link";

//dummy
const genres = [
  "Action",
  "Indie",
  "Adventure",
  "RPG",
  "Strategy",
  "Shooter",
  "Casual",
  "Simulation",
  "Puzzle",
  "Arcade",
  "Platformer",
  "Massively Multiplayer",
  "Racing",
  "Sports",
  "Fighting",
  "Family",
  "Board Games",
  "Educational",
  "Card",
];

const GenresPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Genres</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/games/${genre.toLowerCase().replace(/\s+/g, "-")}`}
            passHref
          >
            <Button variant="outline" className="w-full">
              {genre}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
