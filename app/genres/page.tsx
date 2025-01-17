import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getGenres():Promise<Genre[]> {
  const response = await fetch('http://localhost:8080/v1/genres');
  const data = await response.json();
  return data.data
}

type Genre = {
  id: number,
  name: string,
  slug: string,
}

const GenresPage = async () => {

  const genres = (await getGenres()).reverse()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Genres</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/games/${genre.slug}`}
            passHref
          >
            <Button variant="outline" className="w-full">
              {genre.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
