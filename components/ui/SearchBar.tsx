"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

type SearchBarProps = {
  onResultsShown: () => void;
};

const SearchBar = ({onResultsShown}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoading, setIsLoading } = useLoading();
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      setIsLoading(true);
      onResultsShown();
      router.push(`/games/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search Games..."
        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-4 flex items-center">
          <div className="w-4 h-4 border-2 border-t-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;