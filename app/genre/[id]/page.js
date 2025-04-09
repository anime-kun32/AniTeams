"use client"

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AnimeCard from "../../components/AnimeCard";
import AnimeCardSkeleton from "../../components/AnimeCardSkeleton";

const GenrePage = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState("");
  const [season, setSeason] = useState("");
  const [episodeRange, setEpisodeRange] = useState("1-100");

  const { id } = useParams();

  // Fetch anime data based on filters (genres, year, season, episode range)
  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchAnime = async () => {
        const query = `
          query ($genre: String, $page: Int, $year: Int, $season: String, $episodes: String) {
            Page(page: $page, perPage: 10) {
              media(genre: $genre, seasonYear: $year, season: $season, episodes_greater: $episodes.split("-")[0], episodes_lesser: $episodes.split("-")[1], type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                genres
                coverImage {
                  large
                }
                status
                startDate {
                  year
                  month
                  day
                }
                episodes
                averageScore
              }
            }
          }
        `;
        const variables = { genre: id, page, year, season, episodes: episodeRange };
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();
        if (data?.data?.Page?.media) {
          const transformedData = data.data.Page.media.map((anime) => ({
            id: anime.id,
            image: anime.coverImage.large,
            title: {
              english: anime.title.english,
              romaji: anime.title.romaji,
            },
            status: anime.status,
            releaseDate: `${anime.startDate.year}-${anime.startDate.month}-${anime.startDate.day}`,
            totalEpisodes: anime.episodes,
            rating: anime.averageScore / 10, // Normalize rating to 0-1 scale
          }));
          setAnimeData(transformedData);
        }
        setLoading(false);
      };
      fetchAnime();
    }
  }, [id, page, year, season, episodeRange]);

  const handleGenreSelect = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      }
      return [...prev, genre];
    });
  };

  return (
    <div className="bg-black text-white py-6 px-8 overflow-x-hidden">
      {/* Genre Buttons with horizontal scroll */}
      <div className="flex flex-wrap gap-2 justify-start overflow-x-auto mb-10 pb-4">
        {["Action", "Adventure", "Fantasy", "Comedy", "Drama", "Sci-Fi"].map((genre) => (
          <button
            key={genre}
            className={`px-4 py-2 rounded-full text-xs font-semibold border-2 border-gray-700 transition-all duration-300 ease-in-out ${
              selectedGenres.includes(genre)
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-purple-600 hover:text-white"
            }`}
            onClick={() => handleGenreSelect(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Filters: Year, Season, and Episode Range */}
      <div className="flex justify-between mb-8">
        <div className="flex gap-4">
          {/* Year Dropdown */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border-2 border-gray-700"
          >
            <option value="">Select Year</option>
            {[2023, 2022, 2021].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          {/* Season Dropdown */}
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border-2 border-gray-700"
          >
            <option value="">Select Season</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
          </select>

          {/* Episode Range Dropdown */}
          <select
            value={episodeRange}
            onChange={(e) => setEpisodeRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border-2 border-gray-700"
          >
            <option value="1-12">1-12</option>
            <option value="1-24">1-24</option>
            <option value="1-100">1-100</option>
            <option value="12-24">12-24</option>
            <option value="24-100">24-100</option>
          </select>
        </div>
      </div>

      {/* Anime Cards */}
      <div className="pb-10 mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))
        ) : (
          animeData.map((anime) => (
            <AnimeCard key={anime.id} data={anime} />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-4 overflow-x-auto">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg disabled:bg-gray-600 hover:bg-purple-600"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[1, 2, 3, 4, 5].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`px-6 py-2 rounded-lg text-white border-2 border-gray-700 transition-all duration-300 ease-in-out ${
              page === pageNum ? "bg-purple-600" : "bg-gray-800 hover:bg-purple-600"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-purple-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenrePage;
