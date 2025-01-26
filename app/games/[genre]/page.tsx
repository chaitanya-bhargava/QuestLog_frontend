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
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string }>;
}) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const genre = resolvedParams.genre;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1;

  const initialData = await getGames(genre, page);

  return <GenrePageClient initialData={initialData} genre={genre} />;
};

export default GenrePage;