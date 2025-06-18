import React, { useEffect, useState } from "react";
import Link from "next/link"; // or "react-router-dom" if that's your stack

export default function Aniwatch({ anilistId }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const res = await fetch(`https://your-api.com/aniwatch/episodes/${anilistId}`);
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {episodes.map((ep) => (
        <Link
          key={ep.episodeId}
          href={`/watch/${ep.episodeId}&anilist=${anilistId}`}
          className="relative group rounded-xl overflow-hidden shadow-md"
        >
          <div>
            <img
              src={ep.image}
              alt={`Episode ${ep.number}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent text-white">
              <div className="text-sm font-semibold">
                Episode {ep.number}
              </div>
              <div className="text-xs truncate">{ep.title}</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}
