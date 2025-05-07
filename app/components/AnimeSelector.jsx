"use client"

import React, { useState } from "react";
import Top from "./Top";
import Trending from "./Trending";
import Popular from "./Popular";
import Latest from "./Latest"; 

const AnimeSelector = () => {
  const [selectedTab, setSelectedTab] = useState("top");

  const renderContent = () => {
    switch (selectedTab) {
      case "top":
        return <Top />;
      case "trending":
        return <Trending />;
      case "popular":
        return <Popular />;
      case "latest":
        return <Latest />;  
      default:
        return <Top />;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-center space-x-8 border-b-2 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {(["top", "trending", "popular", "latest"]).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`relative px-4 py-2 font-bold text-lg transition duration-300 ${
              selectedTab === tab
                ? "text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {selectedTab === tab && (
              <div className="absolute w-full h-1 bg-blue-500 bottom-0 left-0 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnimeSelector;
