"use client";
import { useState, useEffect } from "react";
import { Input } from "@heroui/react";
import { CustomSelect } from "./CustomSelect";
import AnimeCard from "./AnimeCard";

const seasons = [
  { value: "SPRING", label: "Spring" },
  { value: "SUMMER", label: "Summer" },
  { value: "FALL", label: "Fall" },
  { value: "WINTER", label: "Winter" },
];

const statuses = [
  { value: "FINISHED", label: "Finished Airing" },
  { value: "RELEASING", label: "Currently Airing" },
  { value: "NOT_YET_RELEASED", label: "Not Airing" },
];

const genres = [
  { value: "Action", label: "Action" },
  { value: "Adventure", label: "Adventure" },
  { value: "Cars", label: "Cars" },
  { value: "Comedy", label: "Comedy" },
  { value: "Drama", label: "Drama" },
  { value: "Fantasy", label: "Fantasy" },
  { value: "Horror", label: "Horror" },
  { value: "Mahou Shoujo", label: "Mahou Shoujo" },
  { value: "Mecha", label: "Mecha" },
  { value: "Music", label: "Music" },
  { value: "Mystery", label: "Mystery" },
  { value: "Psychological", label: "Psychological" },
  { value: "Romance", label: "Romance" },
  { value: "Sci-Fi", label: "Sci-Fi" },
  { value: "Slice of Life", label: "Slice of Life" },
  { value: "Sports", label: "Sports" },
  { value: "Supernatural", label: "Supernatural" },
  { value: "Thriller", label: "Thriller" },
];

export default function AnimeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [season, setSeason] = useState("");
  const [status, setStatus] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      const params = new URLSearchParams({ query: searchQuery });
      if (season) params.append("season", season);
      if (status) params.append("status", status);
      if (genre) params.append("genre", genre);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/advanced-search?${params}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchAnime();
    }
  }, [searchQuery, season, status, genre]);

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <CustomSelect label="Season" items={seasons} value={season} onChange={setSeason} />
        <CustomSelect label="Status" items={statuses} value={status} onChange={setStatus} />
        <CustomSelect label="Genre" items={genres} value={genre} onChange={setGenre} />
        <div className="flex-1 min-w-[300px]">
          <Input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="w-full h-40 bg-gray-700 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((anime) => (
            <AnimeCard key={anime.id} data={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
