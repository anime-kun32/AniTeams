"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import $ from "jquery";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length > 2) {
      fetch(`https://aniwatch-api-net.vercel.app/api/v2/hianime/search/suggestion?q=${query}`)
        .then(res => res.json())
        .then(data => setResults(data.data.suggestions || []))
        .catch(err => console.error("Error fetching search results:", err));
    }
  }, [query]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Search Anime</h2>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="mt-4 max-h-60 overflow-y-auto">
          {results.map((anime) => (
            <div key={anime.id} className="flex items-center gap-4 p-2 border-b">
              <img src={anime.poster} alt={anime.name} className="w-12 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{anime.name}</h3>
                <p className="text-sm text-gray-500">{anime.jname}</p>
                <p className="text-xs text-gray-400">{anime.moreInfo.join(" • ")}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const controls = useAnimation();
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 50) {
        controls.start({ backgroundColor: "rgba(0, 0, 0, 0.7)" });
      } else {
        controls.start({ backgroundColor: "rgba(0, 0, 0, 0)" });
      }
    });

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [controls]);

  return (
    <>
      <motion.div
        animate={controls}
        initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
        className="fixed top-0 left-0 w-full py-4 px-6 z-50 backdrop-blur-md transition-all"
      >
        <Navbar isBordered={false} className="bg-transparent shadow-none">
          <NavbarBrand>
            <span className="text-white text-2xl font-bold">AniTeams</span>
          </NavbarBrand>
          <NavbarContent className="hidden md:flex gap-6" justify="center">
            <NavbarItem>
              <Link href="#" className="text-white hover:text-gray-400">Home</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" className="text-white hover:text-gray-400">About</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" className="text-white hover:text-gray-400">Catalog</Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <button onClick={() => setShowSearch(true)} className="text-white hover:text-gray-400">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </motion.div>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}
