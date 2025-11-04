"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, Clock } from "lucide-react";

type MovieCardProps = {
  id: string;
  title: string;
  synposis: string;
  released: number;
  genre: string;
  image: string;
  favorited: boolean;
  watchLater: boolean;
  onToggleFavorite: (id: string) => Promise<void>;
  onToggleWatchLater: (id: string) => Promise<void>;
};

export default function MovieCard({
  id,
  title,
  synposis,
  released,
  genre,
  image,
  favorited,
  watchLater,
  onToggleFavorite,
  onToggleWatchLater,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [isWatchLater, setIsWatchLater] = useState(watchLater);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isTogglingWatchLater, setIsTogglingWatchLater] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    try {
      await onToggleFavorite(id);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleToggleWatchLater = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTogglingWatchLater) return;
    
    setIsTogglingWatchLater(true);
    try {
      await onToggleWatchLater(id);
      setIsWatchLater(!isWatchLater);
    } catch (error) {
      console.error("Error toggling watch later:", error);
    } finally {
      setIsTogglingWatchLater(false);
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#4BA3C3] to-[#1ED2AF] p-3 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Hover overlay with movie info */}
        {isHovered && (
          <div className="absolute inset-0 bg-[#00003c]/95 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{title} ({released})</h3>
              <p className="text-white/90 text-sm mb-3">{synposis}</p>
              <span className="inline-block bg-[#1ED2AF] text-[#00003c] px-4 py-1 rounded-full text-sm font-semibold">
                {genre}
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors disabled:opacity-50"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Star
                  className={`w-6 h-6 ${
                    isFavorited
                      ? "fill-white text-white"
                      : "text-white"
                  }`}
                />
              </button>
              <button
                onClick={handleToggleWatchLater}
                disabled={isTogglingWatchLater}
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors disabled:opacity-50"
                aria-label={isWatchLater ? "Remove from watch later" : "Add to watch later"}
              >
                <Clock
                  className={`w-6 h-6 ${
                    isWatchLater
                      ? "fill-white text-white"
                      : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}