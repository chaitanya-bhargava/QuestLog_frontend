"use client";

import { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Redirect to the search page with the query
      window.location.href = `/games/search?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <input
      type="text"
      placeholder="Search Games..."
      className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default SearchBar;
