"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PlayIcon, InformationCircleIcon, CalendarIcon, FilmIcon, TvIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Hero() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/trending`);
        if (!response.ok) throw new Error("Network error.");
        const data = await response.json();
        setAnimeList(data.results);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError("Failed to load anime.");
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, []);

  const randomAnime = animeList.length > 0 ? animeList[Math.floor(Math.random() * animeList.length)] : null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {loading ? (
        <div className="relative w-full h-full bg-gray-900 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent h-full w-2/5" />
          <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-black/70 to-transparent" />
          <div className="absolute bottom-5 left-5 space-y-4 w-3/4">
            <div className="bg-gray-700 h-8 w-1/2 rounded-md" />
            <div className="bg-gray-700 h-6 w-1/3 rounded-md" />
            <div className="bg-gray-700 h-4 w-2/3 rounded-md" />
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">{error}</div>
      ) : (
        randomAnime && (
          <div className="relative w-full h-full">
            {randomAnime.trailer ? (
              <iframe
                src={`https://www.youtube.com/embed/${randomAnime.trailer.id}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                className="absolute inset-0 w-full h-full"
                title={randomAnime.title.userPreferred}
                allowFullScreen
                style={{ width: '100%', height: '115%' }} // Increased aspect ratio
              />
            ) : (
              <Image
                src={randomAnime.image}
                alt={randomAnime.title.userPreferred}
                layout="fill"
                objectFit="cover"
                className="transition-all duration-700 ease-in-out"
                unoptimized
              />
            )}

            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-black/70 to-transparent" />

            {/* Information Overlay */}
            <div className="absolute bottom-5 left-5 text-white z-20 max-w-lg space-y-3">
              <h1 className="text-lg md:text-xl font-bold whitespace-normal break-words">
                {randomAnime.title.userPreferred}
              </h1>

              {/* Type, Status, and Icons */}
              <div className="flex items-center space-x-3 text-sm md:text-base">
                <span className="flex items-center space-x-1">
                  {randomAnime.type === "TV" ? <TvIcon className="h-5 w-5" /> : <FilmIcon className="h-5 w-5" />}
                  <span className="font-semibold">{randomAnime.type.toUpperCase()}</span>
                </span>
                <span className="font-semibold">{randomAnime.status.toUpperCase()}</span>
                {randomAnime.totalEpisodes && (
                  <span className="flex items-center space-x-1">
                    <PlayIcon className="h-5 w-5" />
                    <span>{randomAnime.totalEpisodes} Episodes</span>
                  </span>
                )}
              </div>

              <p className="hidden md:block text-sm line-clamp-3 text-gray-300">
                {randomAnime.description
                  .replace(/<br\s*\/?>/g, "")
                  .split(" ")
                  .slice(0, 10)
                  .join(" ")}...
              </p>

              {/* Release Date */}
              <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                <CalendarIcon className="h-4 w-4" />
                <span>{randomAnime.releaseDate}</span>
              </div>

              {/* Watch and Info Buttons */}
              <div className="mt-3 flex space-x-3">
                <Link
                  href={`/watch/${randomAnime.id}`}
                  className="rounded-full bg-red-500 px-5 py-2 flex items-center gap-2 hover:bg-red-600 transition"
                >
                  <PlayIcon className="h-5 w-5" />
                  Watch Now
                </Link>
                <Link
                  href={`/anime/${randomAnime.id}`}
                  className="rounded-full bg-gray-700 px-5 py-2 flex items-center gap-2 hover:bg-gray-600 transition"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
