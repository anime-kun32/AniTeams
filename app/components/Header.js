"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ANILIST_CLIENT_ID = "24943";
const REDIRECT_URI = "https://aniteams-v2.vercel.app/callback"; 
const ANILIST_AUTH_URL = `https://anilist.co/api/v2/oauth/authorize?client_id=${ANILIST_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

const handleLoginRedirect = () => {
  window.location.href = ANILIST_AUTH_URL;
};

function SkeletonLoader() {
  return (
    <div className="flex items-center gap-4 p-2 border-b border-gray-700 animate-pulse">
      <div className="w-16 h-20 bg-gray-700 rounded"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-600 rounded mb-1"></div>
        <div className="h-3 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}

function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length > 2) {
      setLoading(true);
      fetch(`https://anime-kun32.vercel.app/meta/anilist/${query}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black/90 flex justify-center items-start pt-20 z-50 backdrop-blur-sm">
      <div className="w-full max-w-2xl px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg"
          />
          <button onClick={onClose} className="absolute top-3 right-3 text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
          {loading ? (
            <div className="mt-4 space-y-2">{[...Array(3)].map((_, i) => <SkeletonLoader key={i} />)}</div>
          ) : (
            results.length > 0 && (
              <div className="mt-4 bg-gray-900 p-2 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {results.map(anime => (
                  <NextLink key={anime.id} href={`/anime/${anime.id}`} passHref legacyBehavior>
                    <a className="flex items-center gap-4 p-2 border-b border-gray-700 hover:bg-gray-800">
                      <img src={anime.image} className="w-16 h-20 object-cover rounded" alt="" />
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">{anime.title.userPreferred}</h3>
                        <p className="text-sm text-gray-400">{anime.title.native}</p>
                      </div>
                    </a>
                  </NextLink>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AvatarDropdown() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState("/default-avatar.png"); 
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = Cookies.get("anilistAuthToken");
    if (token) {
      setIsLoggedIn(true);
      fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ query: `{ Viewer { avatar { large } } }` })
      })
        .then(res => res.json())
        .then(data => setUserAvatar(data?.data?.Viewer?.avatar?.large || "/default-avatar.png"))
        .catch(() => setUserAvatar("/default-avatar.png"));
    }
  }, []);

  const handleAvatarClick = () => setShowDropdown(!showDropdown);

  return (
    <div className="relative">
      <img
        src={userAvatar}
        className="w-10 h-10 rounded-full cursor-pointer border-4 border-purple-600"
        onClick={handleAvatarClick}
        alt="User Avatar"
      />
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
          {isLoggedIn ? (
            <>
              <NextLink href="/profile" passHref legacyBehavior><a className="block p-2 hover:bg-gray-700">My Profile</a></NextLink>
              <NextLink href="/myanimelist" passHref legacyBehavior><a className="block p-2 hover:bg-gray-700">My AnimeList</a></NextLink>
            </>
          ) : (
            <button onClick={handleLoginRedirect} className="block w-full text-left p-2 hover:bg-gray-700">
              Log in with AniList
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleKeyDown = (e) => e.ctrlKey && e.key === "s" && (e.preventDefault(), setShowSearch(true));

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.div
      animate={{ backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.7)" : "transparent" }}
      className={`fixed top-0 w-full py-4 px-6 z-50 ${isScrolled ? 'backdrop-blur-md border-b border-gray-700' : ''}`}
    >
      <Navbar className="bg-transparent">
        <NavbarBrand><span className="text-white font-bold text-2xl">AniTeams</span></NavbarBrand>
        <NavbarContent className="hidden md:flex gap-6">
          <NavbarItem><NextLink href="/" legacyBehavior><a className="text-white">Home</a></NextLink></NavbarItem>
          <NavbarItem><NextLink href="/about" legacyBehavior><a className="text-white">About</a></NextLink></NavbarItem>
          <NavbarItem><NextLink href="/search" legacyBehavior><a className="text-white">Search</a></NextLink></NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem><button onClick={() => setShowSearch(true)} className="text-white"><MagnifyingGlassIcon className="w-6 h-6" /></button></NavbarItem>
          <NavbarItem><AvatarDropdown /></NavbarItem>
        </NavbarContent>
      </Navbar>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </motion.div>
  );
}
