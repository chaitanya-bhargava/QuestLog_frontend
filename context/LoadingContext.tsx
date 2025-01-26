"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  loadingGenre: string | null;
  setLoadingGenre: (genre: string | null) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGenre, setLoadingGenre] = useState<string | null>(null);

  return (
    <LoadingContext.Provider
      value={{ isLoading, setIsLoading, loadingGenre, setLoadingGenre }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};