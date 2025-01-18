"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import GameCard from "./GameCard";

type Game = {
  id: number;
  name: string;
  image: string;
  genres: { name: string }[];
  release_date: string;
};

type AvatarDropdownProps = {
  title: string;
  games: Game[];
};

const AvatarDropdown = ({ title, games }: AvatarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div className="mt-2 pl-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={{
                  id: game.id,
                  name: game.name,
                  image:
                    game.image == ""
                      ? "https://github.com/shadcn.png"
                      : game.image,
                  genres: game.genres,
                  release_date: game.release_date,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
