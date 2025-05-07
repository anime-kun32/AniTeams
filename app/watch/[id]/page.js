"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import ServerSelector from "./server";
import EpisodeGuide from "@components/watch/EpisodeGuide";
import VideoPlayer from "@components/watch/player/VideoPlayer";

const WatchPage = () => {
  const { id: animeSlug } = useParams();
  const searchParams = useSearchParams();

  const episodeId = searchParams.get("ep");
  const anilistId = Number(searchParams.get("anilist"));


  const [selectedServer, setSelectedServer] = useState(null);
  const [category, setCategory] = useState(null);

  const formattedId = animeSlug && episodeId ? `${animeSlug}?ep=${episodeId}` : "";

  return (
    <div className="flex flex-col lg:flex-row bg-black pt-20 text-white min-h-screen">
      {/* Video Player */}
      <div className="lg:w-3/4 w-full p-4 mt-6">
        {formattedId && selectedServer && category && (
         <VideoPlayer
  id={formattedId} 
  server={selectedServer}
  category={category}
  anilistId={anilistId}
/>

        )}

        <ServerSelector
          episodeId={formattedId}
          setSelectedServer={setSelectedServer}
          setCategory={setCategory}
        />
      </div>

      {/* Episode List */}
      <div className="lg:w-1/4 w-full p-4 border-l border-gray-700">
        {anilistId && <EpisodeGuide animeId={anilistId} activeEpisodeId={formattedId} />}
      </div>

      {/* Eruda for debugging (if needed) */}
      <script src="https://cdn.jsdelivr.net/npm/eruda" />
      <script>eruda.init();</script>
    </div>
  );
};

export default WatchPage;
