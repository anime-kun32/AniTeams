"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EpisodeGuide from "../../components/details/EpisodeGuide";
import CharacterVoiceStaff from "../../components/CharacterVoiceStaff";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchAnimeDetails = async () => {
      const primaryUrl = `${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/data/${id}`;
      const fallbackUrl = `https://hianime-mapper-iv3g.vercel.app/anime/info/${id}`;

      try {
        let response = await fetch(primaryUrl);

        if (!response.ok) {
          console.warn("Primary API failed, trying fallback API...");
          throw new Error("Primary API failed");
        }

        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error("Error fetching from primary API:", error);
        try {
          let fallbackResponse = await fetch(fallbackUrl);
          if (!fallbackResponse.ok) throw new Error("Failed to fetch from fallback API");
          const fallbackData = await fallbackResponse.json();
          setAnime(fallbackData.data);
        } catch (fallbackError) {
          console.error("Error fetching from fallback API:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  return (
    <div className="bg-black text-white min-h-screen">
      {loading ? <SkeletonLoader /> : anime ? <AnimeContent anime={anime} id={id} /> : <ErrorMessage />}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="animate-pulse p-4">
    <div className="h-80 bg-gray-800 rounded w-full mb-5"></div>
    <div className="container mx-auto px-4">
      <div className="h-64 w-48 bg-gray-700 rounded shadow-lg mb-4"></div>
      <div className="h-6 w-3/4 bg-gray-700 rounded mb-2"></div>
      <div className="h-5 w-1/2 bg-gray-700 rounded mb-4"></div>
      <div className="flex space-x-2 mb-4">
        <div className="h-6 w-16 bg-gray-700 rounded"></div>
        <div className="h-6 w-16 bg-gray-700 rounded"></div>
      </div>
      <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
    </div>
  </div>
);

const AnimeContent = ({ anime, id }) => {
  const title = anime.title?.english || anime.title?.romaji || "Unknown Title";
  const coverImage = anime.image || "/default-cover.jpg";
  const description = anime.description || "No description available.";

  return (
    <>
      <div
        className="banner relative h-80 w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${anime.cover})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative -mt-40">
        <img
          src={coverImage}
          alt={title}
          className="rounded shadow-lg w-48"
        />
      </div>

      <div className="anime-details container mx-auto px-4 mt-5">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-2xl text-gray-400">{anime.title?.native || "Unknown Native Name"}</p>

        <div className="mt-4">
          <ul className="genre-list flex flex-wrap">
            {anime.genres?.map((genre, index) => (
              <li key={index} className="bg-gray-700 px-3 py-1 rounded text-sm mr-2">{genre}</li>
            )) || <li className="text-gray-400">Unknown Genres</li>}
          </ul>
        </div>

        <div className="mt-4 text-gray-400">
          <p>{`${anime.type || "Unknown"} | ${anime.totalEpisodes || "N/A"} Episodes | ${anime.duration || "N/A"} min`}</p>
          <p>Rating: {anime.rating || "N/A"}%</p>
          <p>Studio: {anime.studios?.[0] || "Unknown"}</p>
          <p>Season: {anime.season} {anime.startDate?.year || "Unknown"}</p>
          <p>Status: {anime.status}</p>
        </div>

        <div className="mt-4">
          <p dangerouslySetInnerHTML={{ __html: description }}></p>
        </div>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => bookmarkAnime(anime.id, title, coverImage)}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Bookmark
          </button>
        </div>

        <div className="mt-4 flex flex-col items-start">
          <EpisodeGuide animeId={id} />
        </div>

        <div className="mt-4 flex flex-col items-start">
          <CharacterVoiceStaff animeId={id} />
        </div>

        {anime.trailer?.id && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold">Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${anime.trailer.id}`}
              className="rounded-lg w-full h-64 mt-2"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </>
  );
};

const ErrorMessage = () => (
  <div className="text-center text-red-500 mt-10">
    <p>Anime not found</p>
  </div>
);

const bookmarkAnime = (id, title, image) => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  bookmarks.push({ id, title, image });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  alert("Anime bookmarked!");
};

export default AnimeDetails;
