import Link from 'next/link';
import { Button } from "./button"

const genres = [
  'Action',
  'Indie',
  'Adventure',
  'RPG',
  'Strategy',
  'Shooter',
  'Casual',
  'Simulation',
  'Puzzle',
  'Arcade',
  'Platformer',
  'Massively Multiplayer',
  'Racing',
  'Sports',
  'Fighting',
  'Family',
  'Board Games',
  'Educational',
  'Card',
];

const Sidebar = () => {
  const initialGenres = genres.slice(0, 6);

  return (
    <div className="w-64 h-screen bg-background border-r shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Genres</h2>

      <ul className="space-y-2">
        {initialGenres.map((genre) => (
          <li key={genre}>
            <Link
              href={`/games/${genre.toLowerCase().replace(/\s+/g, '-')}`}
              passHref
            >
              <Button variant="ghost" className="w-full justify-start">
                {genre}
              </Button>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Link href="/genres" passHref>
          <Button variant="outline" className="w-full">
            Show All
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;