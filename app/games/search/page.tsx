import GenrePageClient from "@/components/ui/GenrePageClient";
import SearchResultsClient from "@/components/ui/SearchResultsClient";

async function getGames(query: string, page: number) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/search?query=${query}&page=${page}`
  );
  return response.json();
}

const SearchResults = async ({
  searchParams,
}: {
  searchParams: { page?: string; query?: string };
}) => {
  const page = (await searchParams).page
    ? parseInt((await searchParams).page || "1")
    : 1;
  const query = (await searchParams).query || "";

  const initialData = await getGames(query, page);

  return <SearchResultsClient initialData={initialData} query={query} />;
};

export default SearchResults;
