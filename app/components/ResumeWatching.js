'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ResumeWatching() {
  const [resumeData, setResumeData] = useState([]);
  const [removing, setRemoving] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchResume = async () => {
      const uid = Cookies.get('uid');
      if (!uid) return;

      const res = await fetch(`/api/resume?uid=${uid}`);
      const { success, data } = await res.json();

      if (!success || !data?.length) return;

      for (const item of data) {
        try {
          const [epRes, titleRes] = await Promise.all([
            fetch(`/api/episodes?animeId=${item.anilistId}`),
            fetch(`${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/info/${item.anilistId}`),
          ]);

          const { episodes } = await epRes.json();
          const episode = episodes.find((ep) => ep.episodeId === item.animeId);

          const titleData = await titleRes.json();
          const animeTitle = titleData?.title?.romaji || 'Unknown Anime';

          const detailedItem = {
            ...item,
            episodeNumber: episode?.number,
            image: episode?.image || '/placeholder.jpg',
            animeTitle,
          };

          setResumeData((prev) => [...prev, detailedItem]);
        } catch (err) {
          console.error('Failed to fetch resume details for:', item.anilistId);
        }
      }
    };

    fetchResume();
  }, []);

  const handleDelete = async (animeId) => {
    const uid = Cookies.get('uid');
    if (!uid) return;

    setRemoving(animeId);

    try {
      const res = await fetch(`/api/resume?uid=${uid}&animeId=${animeId}`, { method: 'DELETE' });
      const json = await res.json();

      if (res.ok) {
        setResumeData((prev) => prev.filter((item) => item.animeId !== animeId));
        setMessage({ text: json.message || 'Deleted successfully', type: 'success' });
      } else {
        throw new Error(json.error || 'Failed to delete');
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setRemoving(null);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  if (!resumeData.length) return null;

  return (
    <section className="p-4">
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`px-4 py-2 rounded mb-4 w-fit text-sm ${
            message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <h2 className="text-white text-xl font-semibold mb-4">Resume where you left off</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <AnimatePresence>
          {resumeData.map((anime) => {
            const progress = (anime.time / anime.duration) * 100;

            return (
              <motion.div
                key={anime.animeId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-64 shrink-0 relative group"
              >
                <Link
                  href={`/watch/${anime.animeId}&anilist=${anime.anilistId}`}
                  className="relative block rounded overflow-hidden bg-gray-900"
                >
                  <Image
                    src={anime.image}
                    alt={anime.animeTitle}
                    width={256}
                    height={144}
                    className="object-cover w-full h-36"
                  />

                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-sm px-2 py-1">
                    Episode {anime.episodeNumber || '?'}
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </Link>

                <button
                  onClick={() => handleDelete(anime.animeId)}
                  disabled={removing === anime.animeId}
                  className="absolute top-1 right-1 z-10 p-1 rounded-full bg-black/60 hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Delete resume"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <h3 className="text-white text-sm mt-2 truncate">{anime.animeTitle}</h3>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
