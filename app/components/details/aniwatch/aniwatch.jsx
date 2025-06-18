import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Aniwatch({ anilistId }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await fetch(`/api/provider/aniwatch/episodes?animeId=${anilistId}`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error("Aniwatch fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    if (anilistId) fetchEpisodes();
  }, [anilistId]);

  if (loading) return <div className="p-4 text-white">Loading episodes...</div>;
  if (!episodes.length) return <div className="p-4 text-white">No episodes found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
      {episodes.map((ep) => (
        <Link
          key={ep.episodeId}
          href={`/watch/${ep.episodeId}&anilist=${anilistId}`}
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
              <div className="text-xs truncate">{ep.title}</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
