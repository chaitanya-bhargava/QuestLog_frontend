"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarDropdown from "@/components/ui/AvatarDropdown";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

type Game = {
  id: number;
  name: string;
  image: string;
  genres: { name: string }[];
  release_date: string;
};

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [games, setGames] = useState<{
    played: Game[];
    currentlyPlaying: Game[];
    wantToPlay: Game[];
  }>({
    played: [],
    currentlyPlaying: [],
    wantToPlay: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchGames = async () => {
      try {
        const [played, currentlyPlaying, wantToPlay] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/gameLog?shelf=P`, {
            headers: {
              Authorization: `UserID ${user.id}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/gameLog?shelf=C`, {
            headers: {
              Authorization: `UserID ${user.id}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/v1/games/gameLog?shelf=W`, {
            headers: {
              Authorization: `UserID ${user.id}`,
            },
          }),
        ]);

        setGames({
          played: played.data,
          currentlyPlaying: currentlyPlaying.data,
          wantToPlay: wantToPlay.data,
        });
      } catch (err) {
        setError("Failed to fetch games data");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [user]);

  const updateGameShelfStatus = (gameId: number, newShelf: string) => {
    setGames((prevGames) => {
      const updatedPlayed = prevGames.played.filter(
        (game) => game.id !== gameId
      );
      const updatedCurrentlyPlaying = prevGames.currentlyPlaying.filter(
        (game) => game.id !== gameId
      );
      const updatedWantToPlay = prevGames.wantToPlay.filter(
        (game) => game.id !== gameId
      );

      if (newShelf === "NA") {
        return {
          played: updatedPlayed,
          currentlyPlaying: updatedCurrentlyPlaying,
          wantToPlay: updatedWantToPlay,
        };
      }

      const gameToMove = [
        ...prevGames.played,
        ...prevGames.currentlyPlaying,
        ...prevGames.wantToPlay,
      ].find((game) => game.id === gameId);

      if (!gameToMove) return prevGames;

      switch (newShelf) {
        case "P":
          return {
            ...prevGames,
            played: [...updatedPlayed, gameToMove],
            currentlyPlaying: updatedCurrentlyPlaying,
            wantToPlay: updatedWantToPlay,
          };
        case "C":
          return {
            ...prevGames,
            played: updatedPlayed,
            currentlyPlaying: [...updatedCurrentlyPlaying, gameToMove],
            wantToPlay: updatedWantToPlay,
          };
        case "W":
          return {
            ...prevGames,
            played: updatedPlayed,
            currentlyPlaying: updatedCurrentlyPlaying,
            wantToPlay: [...updatedWantToPlay, gameToMove],
          };
        default:
          return prevGames;
      }
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm p-8 pb-16">
        <div className="flex items-center space-x-4 p-6 bg-background/90 backdrop-blur-sm rounded-lg shadow-md">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar_url} alt={user?.name} />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">
              Welcome back to your profile!
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">My Games</h2>

          <div className="mb-8">
            <AvatarDropdown
              title={`Played (${games.played.length})`}
              games={games.played}
              updateGameShelfStatus={updateGameShelfStatus}
            />
          </div>

          <div className="mb-8">
            <AvatarDropdown
              title={`Currently Playing (${games.currentlyPlaying.length})`}
              games={games.currentlyPlaying}
              updateGameShelfStatus={updateGameShelfStatus}
            />
          </div>

          <div className="mb-8">
            <AvatarDropdown
              title={`Want to Play (${games.wantToPlay.length})`}
              games={games.wantToPlay}
              updateGameShelfStatus={updateGameShelfStatus}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
