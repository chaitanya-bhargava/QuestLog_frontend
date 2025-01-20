"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const { user, loading: authLoading } = useAuth();
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
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/gameLog`,
        {
          game_id: game.id,
          shelf: status,
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
    }
  };

  const handleRemoveFromMyGames = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
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
      updateGameShelfStatus(game.id, "NA");
    } catch (error) {
      console.error("Error removing game from shelf:", error);
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
      className="relative w-64 rounded-lg shadow-lg bg-background"
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
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
              <Button
                variant="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleAddToMyGames("W")}
              >
                {getButtonText()}
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="h-14 mb-2">
            <h3 className="text-lg font-semibold line-clamp-2">{game.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleAddToMyGames("W")}
            >
              {shelfStatus && shelfStatus !== "NA" && (
                <Check className="h-4 w-4 mr-2" />
              )}
              {getButtonText()}
            </Button>

            <DropdownMenu
              modal={false}
              open={dropDownOpen}
              onOpenChange={setDropDownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {shelfStatus !== "W" && (
                  <DropdownMenuItem onClick={() => handleAddToMyGames("W")}>
                    Want To Play
                  </DropdownMenuItem>
                )}
                {shelfStatus !== "C" && (
                  <DropdownMenuItem onClick={() => handleAddToMyGames("C")}>
                    Currently Playing
                  </DropdownMenuItem>
                )}
                {shelfStatus !== "P" && (
                  <DropdownMenuItem onClick={() => handleAddToMyGames("P")}>
                    Played
                  </DropdownMenuItem>
                )}

                {shelfStatus && shelfStatus !== "NA" && (
                  <DropdownMenuItem
                    onClick={handleRemoveFromMyGames}
                    className="text-red-600 focus:text-red-600"
                  >
                    Remove
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
