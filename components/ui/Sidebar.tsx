import Link from 'next/link';
import { Button } from './button';
import { Home, User } from 'lucide-react'; // Import icons for Home and Profile

async function getGenres(): Promise<Genre[]> {
  const response = await fetch('http://localhost:8080/v1/genres');
  const data = await response.json();
  return data.data;
}

type Genre = {
  id: number;
  name: string;
  slug: string;
};

const Sidebar = async () => {
  const genres = (await getGenres()).reverse();

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-background border-r shadow-sm p-4 flex flex-col justify-center">
      <Link href="/" passHref>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Home className="h-4 w-4 mr-2" /> {/* Home icon */}
          Home
        </Button>
      </Link>

      <Link href="/profile" passHref>
        <Button variant="ghost" className="w-full justify-start mb-4">
          <User className="h-4 w-4 mr-2" /> {/* Profile icon */}
          Profile
        </Button>
      </Link>

      <h2 className="text-lg font-semibold mb-4">Genres</h2>
      <ul className="space-y-2">
        {genres.slice(0, 6).map((genre) => (
          <li key={genre.id}>
            <Link href={`/games/${genre.slug}`} passHref>
              <Button variant="ghost" className="w-full justify-start">
                {genre.name}
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
