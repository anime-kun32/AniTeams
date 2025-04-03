'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CharacterVoiceStaff({ animeId }) {
  const defaultId = 16498;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let retries = 3;
      const id = animeId || defaultId;
      while (retries > 0) {
        try {
          console.log(`Fetching data for animeId: ${id}`);
          const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              query: `
                query ($id: Int) {
                  Media(id: $id) {
                    characters(perPage: 10) {
                      edges {
                        node {
                          id
                          name {
                            full
                          }
                          image {
                            large
                          }
                        }
                        voiceActors(language: JAPANESE) {
                          id
                          name {
                            full
                          }
                          image {
                            large
                          }
                        }
                      }
                    }
                    staff(perPage: 5) {
                      edges {
                        node {
                          id
                          name {
                            full
                          }
                          image {
                            large
                          }
                          role
                        }
                      }
                    }
                  }
                }
              `,
              variables: { id },
            }),
          });
          if (!response.ok) throw new Error(`Network error: ${response.status}`);
          const json = await response.json();
          if (!json.data || !json.data.Media) throw new Error('Invalid response structure');
          setData(json.data.Media);
          setError(null);
          setLoading(false);
          return;
        } catch (err) {
          console.error('Fetch error:', err);
          retries -= 1;
          if (retries === 0) {
            setError('Failed to fetch data. Please check your connection or try again later.');
            setLoading(false);
          } else {
            await new Promise(res => setTimeout(res, 2000)); // Retry after 2 seconds
          }
        }
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
    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-white font-semibold text-lg border-b-2 border-purple-500 pb-2"
      >
        Character Voice & Staff
        {isOpen ? <ChevronUp className="text-purple-500" /> : <ChevronDown className="text-purple-500" />}
      </button>
      {isOpen && (
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-purple-400 text-xl font-semibold">Characters & Voice Actors</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {data.characters.edges.map(({ node, voiceActors }) => (
                <div key={node.id} className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg">
                  <img src={node.image.large} alt={node.name.full} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="text-white font-medium">{node.name.full}</p>
                    {voiceActors[0] && (
                      <p className="text-purple-400 text-sm">{voiceActors[0].name.full}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-purple-400 text-xl font-semibold">Staff</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {data.staff.edges.map(({ node }) => (
                <div key={node.id} className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg">
                  <img src={node.image.large} alt={node.name.full} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="text-white font-medium">{node.name.full}</p>
                    <p className="text-gray-400 text-sm">{node.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
