import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AnimePahe({ anilistId }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!anilistId) return;

    async function fetchEpisodes() {
      setLoading(true);
      setError(null);

      try {
      
        const mappingRes = await fetch(`/api/provider/animepahe/mapper?id=${anilistId}`);
        if (!mappingRes.ok) throw new Error("Failed to get AnimePahe mapping");
        const mappingData = await mappingRes.json();

        const animepaheId = mappingData?.match?.id;
        if (!animepaheId) throw new Error("No AnimePahe ID found for this AniList ID");

        // Step 2: Fetch episodes by AnimePahe ID
        const episodesRes = await fetch(`/api/provider/animepahe/episodes?id=${animepaheId}`);
        if (!episodesRes.ok) throw new Error("Failed to fetch AnimePahe episodes");
        const episodesData = await episodesRes.json();

        setEpisodes(episodesData || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load episodes");
      } finally {
        setLoading(false);
      }
    }

    fetchEpisodes();
  }, [anilistId]);

  if (loading) return <div className="p-4 text-white">Loading episodes...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!episodes.length) return <div className="p-4 text-white">No episodes found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
      {episodes.map((ep) => (
        <Link
          key={ep.id}
          href={`/animepahe/${ep.id}&anilist=${anilistId}`}
          className="relative group rounded-2xl overflow-hidden shadow-lg border border-zinc-700 bg-zinc-900 transition-transform duration-300 hover:scale-[1.05] hover:shadow-2xl"
        >
          <div className="relative w-full h-32">
            <img
              src={ep.image}
              alt={`Episode ${ep.number}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/90 to-transparent text-white">
              <div className="text-sm font-bold leading-tight">
                Episode {ep.number}
              </div>
              <div className="text-xs truncate">{ep.title || `Episode ${ep.number}`}</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
