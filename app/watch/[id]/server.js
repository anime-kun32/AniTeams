import { useState, useEffect } from "react";
import { FaClosedCaptioning, FaMicrophone, FaFileAlt } from "react-icons/fa";

const ServerSelector = ({ episodeId, setSelectedServer, setCategory }) => {
  const [servers, setServers] = useState({ sub: [], dub: [], raw: [] });
  const [loading, setLoading] = useState(true);
  const [activeServer, setActiveServer] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchServers = async () => {
      if (!episodeId) {
        console.warn("No episodeId provided");
        return;
      }

      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/hianime/episode/servers?animeEpisodeId=${episodeId}`;
      console.log("Fetching servers from:", url);

      try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Server fetch response:", data);

        if (data.success && data.data) {
          setServers(data.data);
          console.log("Setting servers to:", data.data);
        } else {
          console.warn("Invalid response format or success=false:", data);
          setServers({ sub: [], dub: [], raw: [] });
        }
      } catch (err) {
        console.error("Error while fetching servers:", err);
        setServers({ sub: [], dub: [], raw: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [episodeId]);

  const handleSelect = (serverName, category) => {
    console.log("Selected server:", serverName, "Category:", category);
    setSelectedServer(serverName);
    setActiveServer(serverName);
    setActiveCategory(category);
    setCategory(category);
  };

  const renderServers = (category, serversList, icon) => {
    console.log(`Rendering ${category} servers:`, serversList);

    if (!Array.isArray(serversList) || serversList.length === 0) return null;

    return (
      <div className="mt-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {icon} <span className="capitalize">{category}</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 border-b border-gray-700 pb-2">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
            ))
          ) : (
            serversList.map((server, index) => (
              <button
                key={server.serverId || `${category}-${index}`}
                onClick={() => handleSelect(server.serverName, category)}
                className={`px-4 py-2 rounded transition ${
                  activeServer === server.serverName && activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 hover:bg-gray-600"
                }`}
              >
                {server.serverName}
              </button>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">Episode ID: {episodeId}</p>
      {renderServers("sub", servers.sub, <FaClosedCaptioning className="text-yellow-400" />)}
      {renderServers("dub", servers.dub, <FaMicrophone className="text-red-400" />)}
      {renderServers("raw", servers.raw, <FaFileAlt className="text-green-400" />)}
    </div>
  );
};

export default ServerSelector;
