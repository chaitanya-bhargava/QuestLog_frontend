const GenrePage = async ({
  params,
}: {
  params: Promise<{ genre: string }>;
}) => {
  const genre = (await params).genre.replace(/-/g, " ");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold capitalize">{genre} Games</h1>
      <p>This is the page for {genre} games.</p>
    </div>
  );
};

export default GenrePage;
