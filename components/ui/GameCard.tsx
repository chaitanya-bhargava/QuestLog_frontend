"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Loader2, Star } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  image: string;
  genres: { name: string }[];
  release_date: string;
};

type GameCardProps = {
  game: Game;
  updateGameShelfStatus: (gameId: number, newShelf: string) => void;
};

const GameCard = ({ game, updateGameShelfStatus }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [shelfStatus, setShelfStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
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
            setRating(response.data.rating || null);
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
          rating: rating || 0,
        },
        {
          headers: {
            Authorization: `UserID ${user.id}`,
          },
        }
      );
      setShelfStatus(status);
      updateGameShelfStatus(game.id, status);
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
      setRating(null);
      updateGameShelfStatus(game.id, "NA");
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
    setRating(newRating);
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
    <div
      className="relative w-full sm:w-64 rounded-lg shadow-lg bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setDropDownOpen(false);
        setIsHovered(false);
      }}
    >
      <div className="rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-48 object-cover"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-opacity duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingClick(star)}
                    className="focus:outline-none"
                    disabled={isLoading}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (rating || 0)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleAddToMyGames("W")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  getButtonText()
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="h-14 mb-2">
            <Link href={`/game/${game.id}`} className="hover:underline">
              <h3 className="text-lg font-semibold line-clamp-2">{game.name}</h3>
            </Link>
          </div>
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-muted-foreground">{rating}/5</span>
            </div>
          )}
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

            <DropdownMenu
              modal={false}
              open={dropDownOpen}
              onOpenChange={setDropDownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10" disabled={isLoading}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {shelfStatus !== "W" && (
                  <DropdownMenuItem
                    onClick={() => handleAddToMyGames("W")}
                    disabled={isLoading} // Disable dropdown item while loading
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> // Show spinner while loading
                    ) : (
                      "Want To Play"
                    )}
                  </DropdownMenuItem>
                )}
                {shelfStatus !== "C" && (
                  <DropdownMenuItem
                    onClick={() => handleAddToMyGames("C")}
                    disabled={isLoading} // Disable dropdown item while loading
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> // Show spinner while loading
                    ) : (
                      "Currently Playing"
                    )}
                  </DropdownMenuItem>
                )}
                {shelfStatus !== "P" && (
                  <DropdownMenuItem
                    onClick={() => handleAddToMyGames("P")}
                    disabled={isLoading} // Disable dropdown item while loading
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> // Show spinner while loading
                    ) : (
                      "Played"
                    )}
                  </DropdownMenuItem>
                )}

                {shelfStatus && shelfStatus !== "NA" && (
                  <DropdownMenuItem
                    onClick={handleRemoveFromMyGames}
                    className="text-red-600 focus:text-red-600"
                    disabled={isLoading} // Disable dropdown item while loading
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> // Show spinner while loading
                    ) : (
                      "Remove"
                    )}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 w-full rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out transform origin-top ${
          isHovered
            ? "opacity-100 translate-y-0 max-h-40"
            : "opacity-0 -translate-y-1 max-h-0"
        }`}
        style={{
          top: "calc(100% - 8px)",
          backgroundColor: "hsl(var(--background))",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          zIndex: 10,
          transitionProperty: "transform, opacity, max-height",
        }}
      >
        <div className="p-4 border-t">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Genres:</span>
              {game.genres.map((genre) => {
                return <span key={genre.name}>{" " + genre.name}</span>;
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">Release Date:</span>{" "}
              {format(game.release_date, "dd-MM-yyyy")}
            </p>
            {updatedAt && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Updated:</span>{" "}
                {format(new Date(updatedAt), "dd-MM-yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;