import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { PlayIcon } from "@heroicons/react/24/solid";

const EpisodeGuide = ({ animeId }) => {
  const [episodeData, setEpisodeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEpisodeIdentifier, setCurrentEpisodeIdentifier] = useState("");
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const pathname = url.pathname.replace("/watch/", "");
      const searchParams = url.search;
      setCurrentEpisodeIdentifier(decodeURIComponent(`${pathname}${searchParams}`));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://hianime-mapper-six.vercel.app/anime/info/${animeId}`
        );
        const apiData = await response.json();

        if (Array.isArray(apiData?.data?.episodesList)) {
          setEpisodeData(
            apiData.data.episodesList.map((episode) => ({
              episodeId: episode.id, 
              title: `Episode ${episode.number}`,
              number: episode.number,
            }))
          );
        } else {
          setError("Unexpected API response structure.");
        }
      } catch {
        setError("Failed to fetch episode data.");
      }
      setLoading(false);
    };

    fetchData();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-2 p-4 w-full">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse h-8 bg-gray-800 rounded w-full"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 bg-gradient-to-b from-[#0A192F] to-[#112240] rounded-lg shadow-md overflow-hidden">
      <section
        ref={scrollContainerRef}
        className="h-[800px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700"
      >
        {episodeData.map((episode) => {
          const fullEpisodeId = `watch/${episode.episodeId}&anilist=${animeId}`;
          const isCurrent = currentEpisodeIdentifier === `${animeId}?ep=${episode.episodeId}`;

          return (
            <Link
              key={episode.episodeId}
              href={`/${fullEpisodeId}`}
              className={`flex items-center justify-between p-4 text-white rounded-md transition-all duration-300 ${
                isCurrent
                  ? "border-l-4 border-purple-500 bg-opacity-90 relative"
                  : "hover:bg-gray-800 bg-opacity-70" // Darker for non-active
              }`}
            >
              <span className="text-base font-medium">{episode.title}</span>
              {isCurrent && (
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-white">
                  <PlayIcon className="w-4 h-4" />
                </span>
              )}
            </Link>
          );
        })}
      </section>
    </div>
  );
};

export default EpisodeGuide;
