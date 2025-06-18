import React, { useState } from "react";
import Aniwatch from "./Aniwatch"; // assuming AnimePahe coming soon

const providers = ["Aniwatch" /*, "AnimePahe" */];

export default function List({ id }) {
  const [active, setActive] = useState("Aniwatch");

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-6 px-4 border-b border-zinc-700 relative">
        {providers.map((provider) => (
          <button
            key={provider}
            onClick={() => setActive(provider)}
            className={`relative pb-2 font-semibold text-sm transition-all ${
              active === provider
                ? "text-purple-500"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {provider}
            {active === provider && (
              <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-purple-500 transition-all duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Provider content */}
      <div className="mt-4">
        {active === "Aniwatch" && <Aniwatch anilistId={id} />}
        {/* active === "AnimePahe" && <AnimePahe anilistId={id} /> */}
      </div>
    </div>
  );
}
