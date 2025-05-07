import React, { useEffect, useState } from "react";
import AnimeCard from "./AnimeCard";  
import AnimeCardSkeleton from "./AnimeCardSkeleton";  

const Popular = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/popular`);
        const data = await response.json();
        const transformedData = data.results.map((anime) => ({
          id: anime.id,
          image: anime.image,
          title: {
            english: anime.title.english,
            romaji: anime.title.romaji,
          },
          status: anime.status,
          releaseDate: anime.releaseDate,
          totalEpisodes: anime.totalEpisodes,
          rating: anime.rating / 10, 
        }));
        setAnimeData(transformedData);
      } catch (error) {
        console.error("Error fetching popular anime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Popular Anime</h2>
      <div className="pb-10 mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => <AnimeCardSkeleton key={index} />)
          : animeData.map((anime) => <AnimeCard key={anime.id} data={anime} />)}
      </div>
    </div>
  );
};

export default Popular;
