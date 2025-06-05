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

  const playerTypes = [
    { id: 'default', label: 'Default' },
    { id: 'artplayer', label: 'ArtPlayer' },
    { id: 'plyr', label: 'Plyr' },
    { id: 'fast', label: 'Fast'
  ];

  return (
    <div className="flex flex-col lg:flex-row bg-black pt-20 text-white min-h-screen">

      {/* Main Content */}
      <div className="lg:w-3/4 w-full p-4 mt-6 flex flex-col gap-8">

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
                src={`${process.env.NEXT_PUBLIC_PLAYER}?id=${formattedId}&server=${selectedServer}&category=${category}`}
                className="w-full aspect-video rounded-md border border-gray-700"
                allowFullScreen
              />
            )}

            {playerType === 'plyr' && (
              <iframe
                src={`${process.env.NEXT_PUBLIC_PLAYER}/plyr?id=${formattedId}&server=${selectedServer}&category=${category}`}
                className="w-full aspect-video rounded-md border border-gray-700"
                allowFullScreen
              />
            )}
                  
            {playerType === 'fast' && (
              <iframe
                src={`https://megaplay.buzz/stream/s-2/${formattedId}/${category}`}
                className="w-full aspect-video rounded-md border border-gray-700"
                allowFullScreen
              />
            )}
      

            {/* Player Switcher Toolbar */}
            <div className="mt-4 flex gap-2 border border-gray-700 bg-gray-900 rounded-md p-2 w-fit">
              {playerTypes.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPlayerType(id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors duration-200 ${
                    playerType === id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
