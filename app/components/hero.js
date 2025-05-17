"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  InformationCircleIcon,
  CalendarIcon,
  FilmIcon,
  TvIcon,
  PlayIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Hero() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/trending`
        );
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

  const randomAnime =
    animeList.length > 0
      ? animeList[Math.floor(Math.random() * animeList.length)]
      : null;

  // Toggle mute/unmute on YouTube iframe
  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "unMute" : "mute",
          args: [],
        }),
        "*"
      );
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {loading ? (
        <div className="relative w-full h-full bg-gray-900 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent h-full w-2/5" />
          <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-5 left-5 w-3/4 space-y-4 z-10">
            <div className="h-8 w-2/3 bg-gray-700 rounded" />
            <div className="h-6 w-1/3 bg-gray-700 rounded" />
            <div className="h-4 w-1/2 bg-gray-600 rounded" />
            <div className="h-8 w-32 bg-gray-800 rounded-full" />
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          {error}
        </div>
      ) : (
        randomAnime && (
          <div className="relative w-full h-full">
            {randomAnime.trailer ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube.com/embed/${randomAnime.trailer.id}?autoplay=1&mute=1&controls=0&playsinline=1&enablejsapi=1&origin=https://aniteams.vercel.app`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  title={randomAnime.title.userPreferred}
                  className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 scale-[1.25] md:scale-[1.4]"
                  allowFullScreen
                />
              </div>
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

            {/* Gradient overlays */}
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/70 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/40 to-transparent" />

            {/* Info Overlay */}
            <div className="absolute bottom-5 left-5 text-white z-20 max-w-lg space-y-3">
              <h1 className="text-lg md:text-xl font-bold whitespace-normal break-words">
                {randomAnime.title.userPreferred}
              </h1>

              <div className="flex items-center space-x-3 text-sm md:text-base">
                <span className="flex items-center space-x-1">
                  {randomAnime.type === "TV" ? (
                    <TvIcon className="h-5 w-5" />
                  ) : (
                    <FilmIcon className="h-5 w-5" />
                  )}
                  <span className="font-semibold">
                    {randomAnime.type.toUpperCase()}
                  </span>
                </span>
                <span className="font-semibold">
                  {randomAnime.status.toUpperCase()}
                </span>
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
                  .join(" ")}
                ...
              </p>

              <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                <CalendarIcon className="h-4 w-4" />
                <span>{randomAnime.releaseDate}</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/anime/${randomAnime.id}`}
                  className="rounded-full bg-purple-700 px-4 py-1.5 text-sm flex items-center gap-1 hover:bg-purple-600 transition"
                >
                  <InformationCircleIcon className="h-4 w-4" />
                  Details
                </Link>

                <button
                  onClick={toggleMute}
                  className="rounded-full bg-purple-700 p-2 hover:bg-purple-600 transition"
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="h-5 w-5 text-white" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
