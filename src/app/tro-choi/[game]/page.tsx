import { GAMES_DATA } from "@/data/games";
import GameCultureDetailClient from "./client";

export function generateStaticParams() {
  return Object.keys(GAMES_DATA).map((game) => ({
    game,
  }));
}

export default async function GameCultureDetailPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  return <GameCultureDetailClient slug={game} />;
}
