"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

type Game = {
  id: number;
  name: string;
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
          <ul className="space-y-2">
            {games.map((game) => (
              <li key={game.id} className="text-gray-700">
                {game.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
