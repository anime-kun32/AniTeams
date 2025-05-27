import { useState, useEffect } from "react";
import { FaClosedCaptioning, FaMicrophone, FaFileAlt } from "react-icons/fa";

const ServerSelector = ({ episodeId, setSelectedServer, setCategory }) => {
  const [servers, setServers] = useState({ sub: [], dub: [], raw: [] });
  const [loading, setLoading] = useState(true);
  const [activeServer, setActiveServer] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        setServers({
          sub: data.sub || [],
          dub: data.dub || [],
          raw: data.raw || [],
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (episodeId) fetchServers();
  }, [episodeId]);

  const handleSelect = (serverName, category) => {
    setSelectedServer(serverName);
    setActiveServer(serverName);
    setActiveCategory(category);
    setCategory(category);
  };

  const renderServers = (category, serversList, icon) => {
    if (loading) {
      return (
        <div className="mt-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            {icon} <span className="capitalize">{category}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 border-b border-gray-700 pb-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="w-20 h-8 bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      );
    }

    if (serversList.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {icon} <span className="capitalize">{category}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 border-b border-gray-700 pb-2">
          {serversList.map((server) => (
            <button
              key={server.serverId}
              onClick={() => handleSelect(server.serverName, category)}
              className={`px-4 py-2 rounded transition ${
                activeServer === server.serverName && activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-600"
              }`}
            >
              {server.serverName}
            </button>
          ))}
        </div>
      </div>
    );
  };

  try {
    return (
      <div className="mt-4">
        {renderServers("sub", servers.sub, <FaClosedCaptioning className="text-yellow-400" />)}
        {renderServers("dub", servers.dub, <FaMicrophone className="text-red-400" />)}
        {renderServers("raw", servers.raw, <FaFileAlt className="text-green-400" />)}
      </div>
    );
  } catch (error) {
    console.error("Render error in ServerSelector:", error);
    return (
      <div className="text-red-500 mt-4">
        Oops, something went wrong while rendering servers.
      </div>
    );
  }
};

export default ServerSelector;
