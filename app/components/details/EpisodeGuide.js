import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const EpisodeGuide = ({ animeId, epnum, progress }) => {
  const [episodeData, setEpisodeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_HIANIME_MAPPER_URL}/anime/info/${animeId}`),
          fetch(`https://api.ani.zip/mappings?anilist_id=${animeId}`)
        ]);

        const api1 = await res1.json();
        const api2 = await res2.json();

        const list = api1?.data?.episodesList || [];
        const details = api2?.episodes || {};

        const merged = list.map((ep) => {
          const num = ep.number;
          const detail = details?.[num] || {};
          const title = detail?.title?.en || ep.title || `Episode ${num}`;
          const synopsis = detail?.overview || "No synopsis available.";
          const image = detail?.image || "/placeholder.jpg";
          const airDate = detail?.airDate || detail?.airdate || "Unknown Air Date";

          return {
            episodeId: ep.id || `unknown-${num}`,
            title,
            synopsis,
            image,
            airDate,
            number: num,
          };
        });

        setEpisodeData(merged);
      } catch (e) {
        setEpisodeData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [animeId]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 p-6 w-full">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="animate-pulse flex items-center space-x-4 bg-gray-900 p-4 rounded-lg">
            <div className="w-20 h-20 md:w-32 md:h-24 bg-gray-700 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4 overflow-hidden">
      <section className="max-w-4xl p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 border-l-4 border-blue-500 pl-4 text-white">
          Episode Guide
        </h1>
        <div className="space-y-4" ref={scrollContainerRef}>
          {episodeData.map((ep) => {
            const isWatched = parseInt(progress) >= ep.number;
            const isCurrent = parseInt(epnum) === ep.number;

            return (
              <Link
                key={ep.episodeId}
                href={`/watch/${ep.episodeId}&anilist=${animeId}`}
                className={`flex items-center transition-all duration-300 ease-out hover:scale-95 hover:bg-gray-900 rounded-lg p-4 bg-black ${isCurrent ? 'scale-95 ring-2 ring-white opacity-80 pointer-events-none' : ''} ${isWatched ? 'opacity-80' : ''}`}
              >
                <div className="relative w-20 h-20 md:w-32 md:h-24 flex-shrink-0">
                  <Image
                    src={ep.image}
                    alt={`Episode ${ep.number}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md border border-gray-700"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute bottom-1 left-2 text-white font-bold bg-black bg-opacity-60 px-2 py-1 text-xs rounded">
                    EP {ep.number}
                  </span>
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-xl bg-red-600 z-10" style={{ width: isWatched ? '92%' : '0' }} />
                </div>
                <div className="ml-4 flex-1 text-left overflow-hidden">
                  <p className="text-sm md:text-lg font-semibold text-white truncate" title={ep.title}>{ep.title}</p>
                  <p className="text-gray-400 text-xs md:text-sm truncate" title={ep.synopsis}>{ep.synopsis}</p>
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
