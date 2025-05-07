"use client";

import { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";
import AnimeCardSkeleton from "./AnimeCardSkeleton";

function AnimeList() {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnime() {
      try {
        // Fetch anime from Consumet API (updated endpoint)
        const consumetResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/recent-episodes`
        );

        if (!consumetResponse.ok) {
          throw new Error("Failed to fetch anime from Consumet");
        }

        const consumetData = await consumetResponse.json();

        // Log the raw consumet data for debugging
        console.log("Consumet Data:", consumetData);

        const animeList = consumetData.results.slice(0, 20); // Limit results to 20

        // Get AniList status using the normal AniList ID
        const anilistIds = animeList.map((anime) => parseInt(anime.id)).filter(Boolean); // Ensure ID exists and convert to integer

        const query = `
          query ($ids: [Int]) {
            Page(page: 1, perPage: 20) {
              media(id_in: $ids, type: ANIME) {
                id
                status
              }
            }
          }
        `;

        const anilistResponse = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { ids: anilistIds } }),
        });

        if (!anilistResponse.ok) {
          throw new Error("Failed to fetch status from AniList");
        }

        const anilistData = await anilistResponse.json();
        const statusMap = Object.fromEntries(
          anilistData.data.Page.media.map((anime) => [anime.id, anime.status])
        );

        const transformedData = animeList.map((anime) => ({
          id: parseInt(anime.id), // Ensure ID is an integer
          image: anime.image,
          title: {
            english: anime.title.english || "",
            romaji: anime.title.romaji || "",
          },
          status: statusMap[anime.id] || "REALISING",
          releaseDate: anime.releaseDate || null,
          totalEpisodes: anime.episodes || null,
          rating: anime.rating || null,
        }));

        // Log the transformed data for debugging
        console.log("Transformed Data:", transformedData);

        setAnimeData(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Latest Episodes</h2>
        <div className="pb-10 mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8">
          {Array.from({ length: 10 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Latest Episodes</h2>
      <div className="pb-10 mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8">
        {animeData.map((anime) => (
          <AnimeCard key={anime.id} data={anime} />
        ))}
      </div>
    </div>
  );
}

export default AnimeList;
