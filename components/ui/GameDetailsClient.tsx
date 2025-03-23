"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Loader2, Globe, Star, Users } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Game = {
  id: number;
  name: string;
  description: string;
  released: string;
  background_image: string;
  website: string;
  metacritic: number;
  rating: number;
  ratings_count: number;
  developers: { id: number; name: string; slug: string }[];
  publishers: { id: number; name: string; slug: string }[];
  genres: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  platforms: { id: number; name: string; slug: string }[];
};

type GameDetailsClientProps = {
  initialGame: Game;
};

const GameDetailsClient = ({ initialGame }: GameDetailsClientProps) => {
  const [game] = useState<Game>(initialGame);
  const [shelfStatus, setShelfStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchGameLog = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/gameLog?game_id=${game.id}`,
            {
              headers: {
                Authorization: `UserID ${user.id}`,
              },
            }
          );
          if (response.data.shelf !== "NA") {
            setShelfStatus(response.data.shelf);
            setUserRating(response.data.rating || null);
            setUpdatedAt(response.data.updated_at || null);
          }
        } catch (error) {
          console.error("Error fetching game log:", error);
        }
      }
    };

    fetchGameLog();
  }, [game.id, user]);

  const handleAddToMyGames = async (status: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gameLog`,
        {
          game_id: game.id,
          shelf: status,
          rating: userRating || 0,
        },
        {
          headers: {
            Authorization: `UserID ${user.id}`,
          },
        }
      );
      setShelfStatus(status);
    } catch (error) {
      console.error("Error adding game to shelf:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromMyGames = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gameLog?game_id=${game.id}`,
        {
          headers: {
            Authorization: `UserID ${user.id}`,
          },
        }
      );
      setShelfStatus(null);
    } catch (error) {
      console.error("Error removing game from shelf:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingClick = async (newRating: number) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setUserRating(newRating);
    if (shelfStatus) {
      setIsLoading(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/gameLog`,
          {
            game_id: game.id,
            shelf: shelfStatus,
            rating: newRating,
          },
          {
            headers: {
              Authorization: `UserID ${user.id}`,
            },
          }
        );
      } catch (error) {
        console.error("Error updating rating:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getButtonText = () => {
    switch (shelfStatus) {
      case "W":
        return "Want to Play";
      case "C":
        return "Currently Playing";
      case "P":
        return "Played";
      default:
        return "Add to My Games";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Game Image */}
          <div className="relative rounded-lg overflow-hidden shadow-lg h-[300px]">
            <img
              src={game.background_image || "https://github.com/shadcn.png"}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Game Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{game.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-lg">{game.rating.toFixed(1)}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-lg">{game.ratings_count} ratings</span>
                </div>
                {game.metacritic > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Metacritic:</span>
                    <span className={`text-lg ${
                      game.metacritic >= 75 ? "text-green-500" :
                      game.metacritic >= 50 ? "text-yellow-500" :
                      "text-red-500"
                    }`}>
                      {game.metacritic}
                    </span>
                  </div>
                )}
              </div>
              {shelfStatus && (
                <div className="flex items-center gap-2 mb-4">
                  {userRating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg">Your Rating: {userRating}/5</span>
                    </div>
                  )}
                  {updatedAt && (
                    <span className="text-sm text-muted-foreground">
                      {userRating ? "• " : ""}Updated: {format(new Date(updatedAt), "dd-MM-yyyy")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Game Status Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleAddToMyGames("W")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {shelfStatus && shelfStatus !== "NA" && (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    {getButtonText()}
                  </>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-10" disabled={isLoading}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {shelfStatus !== "W" && (
                    <DropdownMenuItem
                      onClick={() => handleAddToMyGames("W")}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        "Want To Play"
                      )}
                    </DropdownMenuItem>
                  )}
                  {shelfStatus !== "C" && (
                    <DropdownMenuItem
                      onClick={() => handleAddToMyGames("C")}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        "Currently Playing"
                      )}
                    </DropdownMenuItem>
                  )}
                  {shelfStatus !== "P" && (
                    <DropdownMenuItem
                      onClick={() => handleAddToMyGames("P")}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        "Played"
                      )}
                    </DropdownMenuItem>
                  )}
                  {shelfStatus && (
                    <DropdownMenuItem
                      onClick={handleRemoveFromMyGames}
                      className="text-red-600 focus:text-red-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        "Remove"
                      )}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Rating Section */}
            {shelfStatus && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rate this game:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingClick(star)}
                      className="focus:outline-none"
                      disabled={isLoading}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= (userRating || 0)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Game Information */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <div 
                  className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Release Date</h2>
                <p className="text-muted-foreground">
                  {format(new Date(game.released), "dd MMMM yyyy")}
                </p>
              </div>

              {game.website && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Website</h2>
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-primary/80"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {game.tags && game.tags.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.platforms && game.platforms.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Platforms</h2>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map((platform) => (
                      <span
                        key={platform.id}
                        className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                      >
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.developers && game.developers.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Developers</h2>
                  <div className="flex flex-wrap gap-2">
                    {game.developers.map((developer) => (
                      <span
                        key={developer.id}
                        className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm"
                      >
                        {developer.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.publishers && game.publishers.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Publishers</h2>
                  <div className="flex flex-wrap gap-2">
                    {game.publishers.map((publisher) => (
                      <span
                        key={publisher.id}
                        className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm"
                      >
                        {publisher.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailsClient; 