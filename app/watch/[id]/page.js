"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import ServerSelector from "./server";
import EpisodeGuide from "../../components/watch/EpisodeGuide";

const WatchPage = () => {
  const { id: animeSlug } = useParams();
  const searchParams = useSearchParams();

  const episodeId = searchParams.get("ep");
  const anilistId = searchParams.get("anilist");

  const [selectedServer, setSelectedServer] = useState(null);
  const [category, setCategory] = useState(null);  
  const [iframeSrc, setIframeSrc] = useState(null);

  const formattedId = animeSlug && episodeId ? `${animeSlug}?ep=${episodeId}` : "";

  // Construct the iframe source URL with the necessary parameters, including server and category
  useEffect(() => {
    if (formattedId && selectedServer && category) {
      // Build the iframe URL with both selectedServer and category
      const iframeUrl = `https://aniteams-player.vercel.app?id=${encodeURIComponent(formattedId)}&server=${encodeURIComponent(selectedServer)}&category=${encodeURIComponent(category)}`;
      setIframeSrc(iframeUrl);
    }
  }, [formattedId, selectedServer, category]);

  return (
    <div className="flex flex-col lg:flex-row bg-black text-white min-h-screen">
      {/* Video Player */}
      <div className="lg:w-3/4 w-full p-4 mt-6">
        {iframeSrc && (
          <div className="relative w-full h-0 pb-[56.25%] bg-black rounded-md overflow-hidden">
            {/* This ensures the iframe maintains a 16:9 aspect ratio */}
            <iframe
              src={iframeSrc}
              frameBorder="0"
              className="absolute top-0 left-0 w-full h-full"
              allow="autoplay; fullscreen"
              title="Anime Player"
            ></iframe>
          </div>
        )}
        <ServerSelector episodeId={formattedId} setSelectedServer={setSelectedServer} setCategory={setCategory} />
      </div>

      {/* Episode List */}
      <div className="lg:w-1/4 w-full p-4 border-l border-gray-700">
        {anilistId && <EpisodeGuide animeId={anilistId} />}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/eruda" />
      <script>eruda.init();</script>
    </div>
  );
};

export default WatchPage;
