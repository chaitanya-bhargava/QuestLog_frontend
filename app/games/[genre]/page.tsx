import GenrePageClient from "@/components/ui/GenrePageClient";

async function getGames(genre: string, page: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/games?genre=${genre}&page=${page}`
  );
  return response.json();
}

const GenrePage = async ({
  params,
  searchParams,
}: {
  params: { genre: string };
  searchParams: { page?: string };
}) => {
  const genre = (await params).genre;
  const page = (await searchParams).page
    ? parseInt((await searchParams).page || "1")
    : 1;

  const initialData = await getGames(genre, page);

  return <GenrePageClient initialData={initialData} genre={genre} />;
};

export default GenrePage;
