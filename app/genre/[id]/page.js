import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import AnimeCard from "../../components/AnimeCard";
import AnimeCardSkeleton from "../../components/AnimeCardSkeleton";

const GenrePage = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Use useParams to get the dynamic 'id' part of the URL (genre)
  const { id } = useParams();
  
  // Fetch genres from AniList API
  useEffect(() => {
    const fetchGenres = async () => {
      const query = `
        query {
          GenreList {
            genre
          }
        }
      `;
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setGenres(data.data.GenreList.map((item) => item.genre));
    };
    fetchGenres();
  }, []);

  // Fetch anime based on selected genre and page
  useEffect(() => {
    if (id) {
      setLoading(true);
      const fetchAnime = async () => {
        const query = `
          query ($genre: String, $page: Int) {
            Page(page: $page, perPage: 10) {
              media(genre: $genre, type: ANIME) {
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
        const variables = { genre: id, page };
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();
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
        setLoading(false);
      };
      fetchAnime();
    }
  }, [id, page]);

  const handleGenreSelect = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      }
      return [...prev, genre];
    });
  };

  return (
    <div className="bg-gray-900 text-white p-6">
      <h1 className="text-3xl mb-6">Genre: {id}</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`px-4 py-2 rounded-lg text-white border ${selectedGenres.includes(genre) ? 'bg-purple-600' : 'bg-gray-700'} transition-colors`}
            onClick={() => handleGenreSelect(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => <AnimeCardSkeleton key={index} />)
        ) : (
          animeData.map((anime) => <AnimeCard key={anime.id} data={anime} />)
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenrePage;
