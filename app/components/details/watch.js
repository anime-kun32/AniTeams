import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";

const EpisodeGuide = ({ animeId, epnum, progress }) => {
  const [episodeData, setEpisodeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const episodesListResponse = await fetch(
          `https://hianime-mapper-iv3g.vercel.app/anime/info/${animeId}`
        );
        const api1Data = await episodesListResponse.json();

        const episodeDetailsResponse = await fetch(
          `https://api.ani.zip/mappings?anilist_id=${animeId}`
        );
        const api2Data = await episodeDetailsResponse.json();

        if (Array.isArray(api1Data?.data?.episodesList) && api2Data?.episodes) {
          const mergedData = api1Data.data.episodesList.map((episode) => {
            const details = api2Data.episodes[episode.number] || {};
            return {
              episodeId: episode.id,
              title: details.title?.en || `Episode ${episode.number}`,
              number: episode.number,
            };
          });

          setEpisodeData(mergedData);
        } else {
          console.error("Unexpected API response structure.");
          setError("Unexpected API response structure.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching episode data:", error);
        setError("Failed to fetch episode data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Extract the current episode ID from the URL
  const currentEpisodeId = router.query.id;

  return (
    <div className="w-full flex justify-center px-4">
      <section className="max-w-4xl p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-4 text-white">
          Episode Guide
        </h1>
        <div className="space-y-4" ref={scrollContainerRef}>
          {episodeData.map((episode) => {
            const isWatched = parseInt(progress) >= episode.number;
            const isActive = currentEpisodeId === episode.episodeId; // Check if the current episode ID matches

            return (
              <Link
                key={episode.episodeId}
                href={`/watch/${episode.episodeId}&anilist=${animeId}`}
                passHref
                className={`flex items-center transition-all duration-300 ease-out hover:bg-gray-900 rounded-lg my-[5px] bg-black p-4 ${isActive ? 'bg-purple-600' : ''}`}
              >
                <div className={`relative flex items-center ${isActive ? 'bg-purple-600 rounded-full p-2' : ''}`}>
                  {isActive && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2L2 22h20L12 2z" />
                    </svg>
                  )}
                  <span className={`text-white font-bold ml-2 ${isActive ? 'text-lg' : 'text-sm'}`}>
                    EP {episode.number} - {episode.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default EpisodeGuide;