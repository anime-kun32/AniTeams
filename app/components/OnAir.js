'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const OnAir = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnAirAnime = async () => {
      try {
        const res = await fetch('/api/onair', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        setAnimeList(data);
      } catch (error) {
        console.error('Error fetching on-air anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnAirAnime();
  }, []);

  const getAirStatus = (airingAt) => {
    const now = new Date();
    const airDate = new Date(airingAt * 1000);
    return airDate > now ? 'unaired' : 'aired';
  };

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2 bg-zinc-800 rounded h-6 w-full" />
        ))}
      </div>
    );
  }

  const sortedAnime = [...animeList].sort((a, b) => {
    return getAirStatus(a.airingAt) === 'unaired' ? -1 : 1;
  });

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Currently Airing Today</h2>

      <div className="space-y-2 mt-4">
        {sortedAnime.map((item, index) => {
          const { media, airingAt, episode } = item;
          const airStatus = getAirStatus(airingAt);

          const isFirstAired =
            airStatus === 'aired' &&
            index > 0 &&
            getAirStatus(sortedAnime[index - 1].airingAt) === 'unaired';

          return (
            <div key={item.id}>
              {isFirstAired && (
                <div className="border-t border-purple-600 my-3" />
              )}

              <div
                className={`flex justify-between items-center py-2 border-l-4 pl-2 ${
                  airStatus === 'aired'
                    ? 'border-gray-500 text-gray-400 opacity-50'
                    : 'border-purple-500 text-white'
                }`}
              >
                <Link
                  href={`/anime/${media.id}`}
                  className="truncate max-w-[60%] hover:underline"
                >
                  {media.title.english || media.title.romaji}
                </Link>
                <span className="text-sm truncate">
                  {airStatus === 'aired'
                    ? `Aired at ${new Date(
                        airingAt * 1000
                      ).toLocaleTimeString()}`
                    : `Ep ${episode} at ${new Date(
                        airingAt * 1000
                      ).toLocaleTimeString()}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnAir;