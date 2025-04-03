'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CharacterVoiceStaff({ animeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://graphql.anilist.co', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            variables: { id: animeId },
          }),
        });
        const json = await response.json();
        setData(json.data.Media);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [animeId]);

  if (loading) return <p className="text-gray-300">Loading...</p>;
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
