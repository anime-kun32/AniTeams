'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import AnimeCard from '@components/AnimeCard';

const sections = ['watching', 'completed', 'planning', 'dropped'];

const WatchlistTabs = () => {
  const [currentTab, setCurrentTab] = useState('watching');
  const [animeData, setAnimeData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const uid = Cookies.get('uid');
      if (!uid) return;

      setLoading(true);

      try {
        const response = await fetch(`/api/watchlist?uid=${uid}`);
        const { watchlist } = await response.json();

        const allSections = {};

        for (const section of sections) {
          const list = watchlist[section] || [];

          const details = await Promise.all(
            list.map(async (entry) => {
              try {
                const res = await fetch(`https://no-drab.vercel.app/meta/anilist/info/${entry.animeId}`);
                if (!res.ok) throw new Error(`Failed to fetch ID ${entry.animeId}`);
                const data = await res.json();

                return {
                  id: data.id,
                  image: data.image,
                  title: {
                    english: data.title?.english || '',
                    romaji: data.title?.romaji || '',
                  },
                  status: data.status,
                  releaseDate: data.releaseDate,
                  totalEpisodes: data.totalEpisodes,
                  rating: data.rating ? data.rating / 10 : null,
                };
              } catch (error) {
                console.error(`Error fetching anime ID ${entry.animeId}:`, error.message);
                return null;
              }
            })
          );

          allSections[section] = details.filter(Boolean); // remove nulls
        }

        setAnimeData(allSections);
      } catch (error) {
        console.error('Error fetching user watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const activeList = animeData[currentTab] || [];

  return (
    <div className="p-6 w-full max-w-[1400px] mx-auto">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">My Watchlist</h2>

      <div className="flex justify-center gap-4 flex-wrap mb-8">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setCurrentTab(section)}
            className={`capitalize px-5 py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 ${
              currentTab === section
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading {currentTab} anime...</p>
      ) : activeList.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No anime found in {currentTab}.</p>
      ) : (
        <div className="pb-10 mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8">
          {activeList.map((anime) => (
            <AnimeCard key={anime.id} data={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistTabs;
