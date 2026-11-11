import { GAMES_DATA } from "@/data/games";
import GamePlayClient from "./client";

export function generateStaticParams() {
  return Object.keys(GAMES_DATA).map((game) => ({
    game,
  }));
}

export default async function GamePlayPage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  return <GamePlayClient gameKey={game} />;
}
