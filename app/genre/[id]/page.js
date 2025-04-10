import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AnimeCard from "../../components/AnimeCard";
import AnimeCardSkeleton from "../../components/AnimeCardSkeleton";

const allGenres = [
  "Action", "Adventure", "Cars", "Comedy", "Drama", "Fantasy", "Historical",
  "Horror", "Isekai", "Mecha", "Music", "Mystery", "Psychological", "Romance",
  "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller",
  "Ecchi", "Hentai", "Mahou Shoujo", "Martial Arts", "Military",
  "Parody", "Police", "Samurai", "School", "Shoujo", "Shounen",
  "Space", "Super Power", "Vampire", "Yaoi", "Yuri"
];

const GenrePage = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState("");
  const [season, setSeason] = useState("");
  const [episodeRange, setEpisodeRange] = useState("1-100");
  const [country, setCountry] = useState("");

  const { id } = useParams();

  useEffect(() => {
    if (id || selectedGenres.length > 0 || year || season || country) {
      setLoading(true);
      const [minEpisodes, maxEpisodes] = episodeRange.split("-").map(Number);

      const fetchAnime = async () => {
        const query = `
          query ($genres: [String], $page: Int, $year: Int, $season: MediaSeason, $minEpisodes: Int, $maxEpisodes: Int, $country: CountryCode) {
            Page(page: $page, perPage: 18) {
              media(
                genre_in: $genres,
                seasonYear: $year,
                season: $season,
                episodes_greater: $minEpisodes,
                episodes_lesser: $maxEpisodes,
                countryOfOrigin: $country,
                type: ANIME,
                sort: POPULARITY_DESC
              ) {
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

        const variables = {
          genres: selectedGenres.length ? selectedGenres : [id],
          page,
          year: year ? parseInt(year) : null,
          season: season || null,
          minEpisodes,
          maxEpisodes,
          country: country || null,
        };

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
            rating: anime.averageScore / 10,
          }));
          setAnimeData(transformedData);
        } else {
          setAnimeData([]);
        }
        setLoading(false);
      };

      fetchAnime();
    }
  }, [id, selectedGenres, page, year, season, episodeRange, country]);

  const handleGenreSelect = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="bg-black text-white py-6 px-8 overflow-x-hidden">
      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4">
        {allGenres.map((genre) => (
          <button
            key={genre}
            className={`px-3 py-1 rounded-full text-sm font-semibold border-2 border-gray-700 transition-all duration-300 ease-in-out ${
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

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 overflow-x-auto">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border-2 border-gray-700"
        >
          <option value="">Select Year</option>
          {Array.from({ length: 2026 - 1970 }, (_, i) => 1970 + i)
            .reverse()
            .map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
        </select>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border-2 border-gray-700"
        >
          <option value="">Select Season</option>
          <option value="WINTER">Winter</option>
          <option value="SPRING">Spring</option>
          <option value="SUMMER">Summer</option>
          <option value="FALL">Fall</option>
        </select>

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

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border-2 border-gray-700"
        >
          <option value="">Country</option>
          <option value="JP">Japan</option>
          <option value="CN">China</option>
        </select>
      </div>

      {/* Anime Cards */}
      <div className="pb-10 mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8 gap-5">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))
          : animeData.map((anime) => <AnimeCard key={anime.id} data={anime} />)}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-2 overflow-x-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-md border-2 border-gray-700 min-w-[40px] ${
              page === i + 1
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-purple-500 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenrePage;
