"use client";

import { useState, useEffect, useCallback } from "react";
import MovieCard from "@/components/MovieCard";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

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

export default function FavoritesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/favorites?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        setMovies(data.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleToggleFavorite = async (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    try {
      if (movie.favorited) {
        await fetch(`/api/favorites/${id}`, { method: "DELETE" });
        // Remove from favorites list immediately
        setMovies(movies.filter(m => m.id !== id));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleToggleWatchLater = async (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    try {
      if (movie.watchLater) {
        await fetch(`/api/watch-later/${id}`, { method: "DELETE" });
      } else {
        await fetch(`/api/watch-later/${id}`, { method: "POST" });
      }
      // Update the local state
      setMovies(movies.map(m => 
        m.id === id ? { ...m, watchLater: !m.watchLater } : m
      ));
    } catch (error) {
      console.error("Error toggling watch later:", error);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (movies.length === 6) { // Only allow next if we have a full page
      setPage(page + 1);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-white/70">Movies you've marked as favorites</p>
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-white text-xl mb-4">No favorite movies yet</div>
            <p className="text-white/70">
              Start adding movies to your favorites by clicking the star icon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 mb-8">
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
            <div className="inline-flex rounded-full overflow-hidden">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="bg-[#1ED2AF] text-[#00003c] px-8 py-3 font-semibold border-r-2 border-[#00003c] hover:bg-[#4BA3C3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={movies.length < 6}
                className="bg-[#1ED2AF] text-[#00003c] px-8 py-3 font-semibold hover:bg-[#4BA3C3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}