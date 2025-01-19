"use client"; // Mark this as a Client Component

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarDropdown from "@/components/ui/AvatarDropdown";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook
import axios from "axios";

type Game = {
  id: number;
  name: string;
  image: string;
  genres: { name: string }[];
  release_date: string;
};

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth(); // Get user data from AuthContext
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

  // Function to fetch games data
  const fetchGames = async () => {
    if (!user) return; // Don't fetch data if user is not available

    try {
      // Fetch games for each shelf
      const [played, currentlyPlaying, wantToPlay] = await Promise.all([
        axios.get(`http://localhost:8080/v1/games/gameLog?shelf=P`, {
          headers: {
            Authorization: `UserID ${user.id}`,
          },
        }),
        axios.get(`http://localhost:8080/v1/games/gameLog?shelf=C`, {
          headers: {
            Authorization: `UserID ${user.id}`,
          },
        }),
        axios.get(`http://localhost:8080/v1/games/gameLog?shelf=W`, {
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

  // Function to refresh games data
  const refreshGames = async () => {
    setLoading(true);
    await fetchGames();
  };

  useEffect(() => {
    fetchGames();
  }, [user]);

  if (authLoading) {
    return <div>Loading user data...</div>; // Show a loading state while fetching user data
  }

  if (!user) {
    return <div>No user data available</div>; // Fallback if user data is not available
  }

  if (loading) {
    return <div>Loading games data...</div>; // Show a loading state while fetching games data
  }

  if (error) {
    return <div>{error}</div>; // Show an error message if fetching fails
  }

  return (
    <ProtectedRoute>
      <div className="p-8 pb-16">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">My Games</h2>

          <AvatarDropdown
            title={`Played (${games.played.length})`}
            games={games.played}
            refreshGames={refreshGames} // Pass refreshGames as a prop
          />

          <AvatarDropdown
            title={`Currently Playing (${games.currentlyPlaying.length})`}
            games={games.currentlyPlaying}
            refreshGames={refreshGames} // Pass refreshGames as a prop
          />

          <AvatarDropdown
            title={`Want to Play (${games.wantToPlay.length})`}
            games={games.wantToPlay}
            refreshGames={refreshGames} // Pass refreshGames as a prop
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;