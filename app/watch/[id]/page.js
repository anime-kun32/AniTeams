'use client';

import { useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import ServerSelector from './server';
import EpisodeGuide from '@components/watch/EpisodeGuide';
import VideoPlayer from '@components/watch/player/VideoPlayer';
import CommentSection from '@components/comments/CommentSection';

const WatchPage = () => {
  const { id: animeSlug } = useParams();
  const searchParams = useSearchParams();

  const episodeId = searchParams.get('ep');
  const anilistId = Number(searchParams.get('anilist'));

  const [selectedServer, setSelectedServer] = useState(null);
  const [category, setCategory] = useState(null);
  const [playerType, setPlayerType] = useState('default'); // 'default', 'artplayer', 'plyr'

  const formattedId = animeSlug && episodeId ? `${animeSlug}?ep=${episodeId}` : '';

  return (
    <div className="flex flex-col lg:flex-row bg-black pt-20 text-white min-h-screen">

      {/* Main Content */}
      <div className="lg:w-3/4 w-full p-4 mt-6 flex flex-col gap-8">

        {/* Player Switcher */}
        {formattedId && selectedServer && category && (
          <div className="flex items-center gap-4">
            <label htmlFor="playerType" className="text-sm">Player:</label>
            <select
              id="playerType"
              value={playerType}
              onChange={(e) => setPlayerType(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded"
            >
              <option value="default">Default</option>
              <option value="artplayer">ArtPlayer</option>
              <option value="plyr">Plyr</option>
            </select>
          </div>
        )}

        {/* Player Display */}
        {formattedId && selectedServer && category && (
          <>
            {playerType === 'default' && (
              <VideoPlayer
                id={formattedId}
                server={selectedServer}
                category={category}
                anilistId={anilistId}
              />
            )}

            {playerType === 'artplayer' && (
              <iframe
                src={`https://aniteams-player-livid.vercel.app?id=${formattedId}&server=${selectedServer}&category=${category}`}
                className="w-full aspect-video rounded-md border border-gray-700"
                allowFullScreen
              />
            )}

            {playerType === 'plyr' && (
              <iframe
                src={`https://aniteams-player-livid.vercel.app/plyr?id=${formattedId}&server=${selectedServer}&category=${category}`}
                className="w-full aspect-video rounded-md border border-gray-700"
                allowFullScreen
              />
            )}
          </>
        )}

        {/* Server Selector */}
        <ServerSelector
          episodeId={formattedId}
          setSelectedServer={setSelectedServer}
          setCategory={setCategory}
        />

        {/* Comments */}
        {formattedId && <CommentSection id={formattedId} />}
      </div>

      {/* Sidebar (Episode Guide) */}
      <div className="lg:w-1/4 w-full p-4 border-l border-gray-700">
        {anilistId && (
          <EpisodeGuide animeId={anilistId} activeEpisodeId={formattedId} />
        )}
      </div>

      {/* Eruda for debugging */}
      <script src="https://cdn.jsdelivr.net/npm/eruda" />
      <script>eruda.init();</script>
    </div>
  );
};

export default WatchPage;
