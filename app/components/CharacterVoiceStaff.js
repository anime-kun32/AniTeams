"use client";

import { useState, useEffect } from 'react';
import { fetchAnimeData } from '../actions/aniListFetch'; 

export default function CharacterVoiceStaff({ animeId }) {
  const defaultId = 16498;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const id = animeId || defaultId;
      setLoading(true);
      try {
        const animeData = await fetchAnimeData(id);
        if (!animeData) {
          throw new Error('Failed to fetch anime data');
        }
        setData(animeData);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data. Please check your connection or try again later.');
        setLoading(false);
      }
    }

    fetchData();
  }, [animeId]);

  if (loading) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg shadow-md animate-pulse">
        <div className="w-full h-6 bg-gray-700 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-24 h-4 bg-gray-700 rounded"></div>
                <div className="w-16 h-3 bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-gray-900 py-6">
      <div className="px-4">
        <h2 className="text-white text-2xl font-semibold mb-4">Characters & Voice Actors</h2>
        <div className="w-full overflow-x-auto whitespace-nowrap">
          <div className="flex gap-6">
            {data.characters.edges.map(({ node, voiceActors }) => (
              <div key={node.id} className="flex flex-col items-center shrink-0">
                <img src={node.image.large} alt={node.name.full} className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg" />
                <span className="mt-2 text-white text-center text-sm">{node.name.full}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-white text-2xl font-semibold mt-10 mb-4">Staff</h2>
        <div className="w-full overflow-x-auto whitespace-nowrap">
          <div className="flex gap-6">
            {data.staff.edges.map(({ node }) => (
              <div key={node.id} className="flex flex-col items-center shrink-0">
                <img src={node.image.large} alt={node.name.full} className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg" />
                <span className="mt-2 text-white text-center text-sm">{node.name.full}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
