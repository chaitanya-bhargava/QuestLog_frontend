"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { format } from 'date-fns';


type Game = {
  id: number;
  name: string;
  image: string;
  genres: { name: string }[];
  release_date: string;
};

type GameCardProps = {
  game: Game;
};

const GameCard = ({ game }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [dropDownOpen,setDropDownOpen] = useState(false);

  const handleAddToMyGames = (status: string) => {
    console.log(`Added "${game.name}" to "${status}"`);
  };

  return (
    <div
      className="relative w-64 rounded-lg shadow-lg bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setDropDownOpen(false)
        setIsHovered(false)
      }}
    >
      <div className="rounded-lg overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-48 object-cover"
        />

        <div className="p-4">
          <div className="h-14 mb-2">
            <h3 className="text-lg font-semibold line-clamp-2">{game.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleAddToMyGames("Want to Play")}
            >
              Want to Play
            </Button>

            <DropdownMenu modal={false} open={dropDownOpen} onOpenChange={setDropDownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleAddToMyGames("Want to Play")}
                >
                  Want to Play
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAddToMyGames("Currently Playing")}
                >
                  Currently Playing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddToMyGames("Played")}>
                  Played
                </DropdownMenuItem>
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
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          zIndex: 10,
          transitionProperty: "transform, opacity, max-height",
        }}
      >
        <div className="p-4 border-t">
          <div className="space-y-2">
            <p>
            <span className="font-semibold">Genres:</span>
            {game.genres.map((genre)=>{
              return <span key={genre.name}>{" "+genre.name}</span>
            })}
            </p>
            <p>
              <span className="font-semibold">Release Date:</span>{" "}
              {format(game.release_date,"dd-MM-yyyy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;