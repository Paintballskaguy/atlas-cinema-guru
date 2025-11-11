"use client";

import { useState, useEffect, useCallback } from "react";
import MovieCard from "@/components/MovieCard";

type Movie = {
  id: string;
  title: string;
  synposis: string;
  released: number;
  genre: string;
  image: string;
  favorited: boolean;
  watchLater: boolean;
};

// This component handles the client-side data fetching, state, and UI for Watch Later.
export default function WatchLaterClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const fetchWatchLater = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/watch-later?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        // The API returns { watchLater: Movie[] }
        setMovies(data.watchLater || []);
      }
    } catch (error) {
      console.error("Error fetching watch later:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchWatchLater();
  }, [fetchWatchLater]);

  const handleToggleFavorite = async (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    try {
      if (movie.favorited) {
        await fetch(`/api/favorites/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/favorites/${id}`, { method: "POST" });
      }
      // Update the local state optimistically
      setMovies(movies.map(m => 
        m.id === id ? { ...m, favorited: !m.favorited } : m
      ));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleToggleWatchLater = async (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    try {
      if (movie.watchLater) {
        // DELETE request to remove from watch later
        await fetch(`/api/watch-later/${id}`, { method: "DELETE" });
        // Optimistically remove from watch later list
        setMovies(movies.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error("Error toggling watch later:", error);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      // Decrement page and trigger re-fetch in useEffect
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    // Only allow next if we received a full page of results
    if (movies.length === ITEMS_PER_PAGE) { 
      // Increment page and trigger re-fetch in useEffect
      setPage(page + 1);
    }
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Watch Later</h1>
        <p className="text-white/70">Movies you plan to watch</p>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-white text-xl mb-4">No movies in your watch later list</div>
          <p className="text-white/70">
            Start adding movies to watch later by clicking the clock icon
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              {...movie}
              onToggleFavorite={handleToggleFavorite}
              onToggleWatchLater={handleToggleWatchLater}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && movies.length > 0 && (
        <div className="flex justify-center">
          <div className="inline-flex rounded-full overflow-hidden shadow-lg">
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className="bg-[#1ED2AF] text-[#00003c] px-8 py-3 font-semibold border-r-2 border-[#00003c] hover:bg-[#4BA3C3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={movies.length < ITEMS_PER_PAGE}
              className="bg-[#1ED2AF] text-[#00003c] px-8 py-3 font-semibold hover:bg-[#4BA3C3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}