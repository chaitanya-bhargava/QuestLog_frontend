import { notFound } from "next/navigation";
import GameDetailsClient from "@/components/ui/GameDetailsClient";

async function getGame(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/game?id=${id}`
  );
  return response.json();
}

const GamePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  const game = await getGame(resolvedParams.id);

  if (!game) {
    notFound();
  }

  return <GameDetailsClient initialGame={game} />;
};

export default GamePage;
