"use client";

import { useState, useEffect, useCallback } from "react";
import MovieCard from "./MovieCard";
import { useDebounce } from "use-debounce";

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

const ALL_GENRES = [
  "Romance",
  "Horror",
  "Drama",
  "Action",
  "Mystery",
  "Fantasy",
  "Thriller",
  "Western",
  "Sci-Fi",
  "Adventure",
];

export default function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [minYear, setMinYear] = useState("1990");
  const [maxYear, setMaxYear] = useState("2024");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(ALL_GENRES);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        minYear: minYear,
        maxYear: maxYear,
        genres: selectedGenres.join(","),
      });
      
      if (debouncedSearch) {
        params.append("query", debouncedSearch);
      }

      const response = await fetch(`/api/titles?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMovies(data.titles || []);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, minYear, maxYear, selectedGenres]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
    setPage(1); // Reset to first page when filters change
  };

  const handleToggleFavorite = async (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    if (movie.favorited) {
      await fetch(`/api/favorites/${id}`, { method: "DELETE" });
    } else {
      await fetch(`/api/favorites/${id}`, { method: "POST" });
    }
  };

  const handleToggleWatchLater = async (id: string) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    if (movie.watchLater) {
      await fetch(`/api/watch-later/${id}`, { method: "DELETE" });
    } else {
      await fetch(`/api/watch-later/${id}`, { method: "POST" });
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
    <div className="p-8">
      {/* Search and Filters */}
      <div className="mb-8 flex gap-8">
        {/* Left side - Search and Year filters */}
        <div className="flex-shrink-0 w-96">
          <div className="mb-6">
            <label className="block text-white text-sm mb-2">Search</label>
            <input
              type="text"
              placeholder="Search Movies..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 rounded-full bg-transparent border-2 border-[#1ED2AF] text-white placeholder-white/50 focus:outline-none focus:border-[#4BA3C3]"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white text-sm mb-2">Min Year</label>
              <input
                type="number"
                value={minYear}
                onChange={(e) => {
                  setMinYear(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 rounded-full bg-transparent border-2 border-[#1ED2AF] text-white focus:outline-none focus:border-[#4BA3C3]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-white text-sm mb-2">Max Year</label>
              <input
                type="number"
                value={maxYear}
                onChange={(e) => {
                  setMaxYear(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2 rounded-full bg-transparent border-2 border-[#1ED2AF] text-white focus:outline-none focus:border-[#4BA3C3]"
              />
            </div>
          </div>
        </div>

        {/* Right side - Genre filters */}
        <div className="flex-1">
          <label className="block text-white text-sm mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenres.includes(genre)
                    ? "bg-[#1ED2AF] text-[#00003c]"
                    : "bg-transparent border-2 border-[#1ED2AF] text-[#1ED2AF]"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Loading...</div>
        </div>
      ) : movies.length === 0 ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">No movies found</div>
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
  );
}