"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarDropdown from "@/components/ui/AvatarDropdown";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import axios from "axios";

type Game = {
  id: number;
  name: string;
  image: string;
  genres: { name: string }[];
  release_date: string;
};

type ProfileData = {
  id: string;
  name: string;
  avatar_url: string;
  username: string;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<ProfileData | null>(null);
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

  const isOwnProfile = user?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/users/${username}/profile`
        );
        setProfile(profileRes.data);

        const [played, currentlyPlaying, wantToPlay] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/users/${username}/games?shelf=P`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/users/${username}/games?shelf=C`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/users/${username}/games?shelf=W`
          ),
        ]);

        setGames({
          played: played.data || [],
          currentlyPlaying: currentlyPlaying.data || [],
          wantToPlay: wantToPlay.data || [],
        });
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Profile not found");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">{error}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            The user you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm p-4 md:p-8 pb-16">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-6 bg-background/90 backdrop-blur-sm rounded-lg shadow-md">
        <Avatar className="h-12 w-12 md:h-16 md:w-16">
          <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
          <AvatarFallback>{profile?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold">{profile?.name}</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {isOwnProfile
              ? "Welcome back to your profile!"
              : `@${profile?.username}`}
          </p>
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          {isOwnProfile ? "My Games" : `${profile?.name}'s Games`}
        </h2>

        <div className="mb-6 md:mb-8">
          <AvatarDropdown
            title={`Played (${games.played.length})`}
            games={games.played}
            updateGameShelfStatus={updateGameShelfStatus}
          />
        </div>

        <div className="mb-6 md:mb-8">
          <AvatarDropdown
            title={`Currently Playing (${games.currentlyPlaying.length})`}
            games={games.currentlyPlaying}
            updateGameShelfStatus={updateGameShelfStatus}
          />
        </div>

        <div className="mb-6 md:mb-8">
          <AvatarDropdown
            title={`Want to Play (${games.wantToPlay.length})`}
            games={games.wantToPlay}
            updateGameShelfStatus={updateGameShelfStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
