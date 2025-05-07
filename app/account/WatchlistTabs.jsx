'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import AnimeCard from '@components/AnimeCard';

const sections = ['watching', 'completed', 'planning', 'dropped'];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAnimeDetailsWithRateLimit = async (list) => {
  const batchSize = 10; // 10 requests per batch
  const delayBetweenBatches = 7000; // 7 seconds between batches

  const results = [];
  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (entry) => {
        const animeId = parseInt(entry.animeId);
        const query = `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              status
              startDate {
                year
              }
              episodes
              averageScore
            }
          }
        `;

        const variables = { id: animeId };

        try {
          const { data } = await axios.post('https://graphql.anilist.co', {
            query,
            variables,
          });

          const anime = data.data.Media;

          return {
            id: anime.id,
            image: anime.coverImage.large,
            title: {
              english: anime.title.english,
              romaji: anime.title.romaji,
            },
            status: anime.status,
            releaseDate: anime.startDate.year,
            totalEpisodes: anime.episodes,
            rating: anime.averageScore / 10,
          };
        } catch (err) {
          console.error(`AniList error for ID ${animeId}:`, err);
          return null;
        }
      })
    );

    results.push(...batchResults.filter(Boolean));

    if (i + batchSize < list.length) {
      await delay(delayBetweenBatches);
    }
  }

  return results;
};

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

          const animeDetails = await fetchAnimeDetailsWithRateLimit(list);
          allSections[section] = animeDetails;
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
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7">
          {activeList.map((anime) => (
            <AnimeCard key={anime.id} data={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistTabs;
