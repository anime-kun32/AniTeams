"use client";

import { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Settings } from "lucide-react";
import Swal from "sweetalert2";

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
      fetch(`${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/${query}`)
        .then((res) => res.json())
        .then((data) => {
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
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg"
          />
          <button onClick={onClose} className="absolute top-3 right-3 text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
          {loading ? (
            <div className="mt-4 space-y-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : (
            results.length > 0 && (
              <div className="mt-4 bg-gray-900 p-2 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {results.map((anime) => (
                  <Link key={anime.id} href={`/anime/${anime.id}`}>
                    <div className="flex items-center gap-4 p-2 border-b border-gray-700 hover:bg-gray-800 cursor-pointer">
                      <img src={anime.image} className="w-16 h-20 object-cover rounded" alt="" />
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">{anime.title.userPreferred}</h3>
                        <p className="text-sm text-gray-400">{anime.title.native}</p>
                      </div>
                    </div>
                  </Link>
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const uid = Cookies.get("uid");
    if (uid) {
      fetch("/api/user-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data.success ? data.user : null);
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAvatarClick = () => {
    if (!loading) setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("uid");
    setShowDropdown(false);
    location.reload(); // Full page refresh
  };

  const handleSettingsClick = () => {
    Swal.fire({
      title: "Coming Soon!",
      text: "This feature is not available yet.",
      icon: "info",
      confirmButtonColor: "#6366f1",
      confirmButtonText: "OK",
      background: "#111827",
      color: "#fff",
    });
  };

  return (
    <div className="relative z-50">
      <div className="relative w-10 h-10">
        <img
          src={user?.avatar || "/default-avatar.png"}
          className={`w-10 h-10 rounded-full object-cover border-4 transition ${
            loading
              ? "opacity-50 cursor-not-allowed border-gray-600"
              : "cursor-pointer border-purple-600 hover:scale-105"
          }`}
          onClick={handleAvatarClick}
          alt="User Avatar"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              width="24"
              height="24"
              stroke="#fff"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>{`
                .spinner {
                  transform-origin: center;
                  animation: rotate 2s linear infinite;
                }
                .spinner circle {
                  stroke-linecap: round;
                  animation: dash 1.5s ease-in-out infinite;
                }
                @keyframes rotate {
                  100% {
                    transform: rotate(360deg);
                  }
                }
                @keyframes dash {
                  0% {
                    stroke-dasharray: 0 150;
                    stroke-dashoffset: 0;
                  }
                  47.5% {
                    stroke-dasharray: 42 150;
                    stroke-dashoffset: -16;
                  }
                  95%, 100% {
                    stroke-dasharray: 42 150;
                    stroke-dashoffset: -59;
                  }
                }
              `}</style>
              <g className="spinner">
                <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3"></circle>
              </g>
            </svg>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 bg-gray-900 rounded-xl shadow-lg ring-1 ring-white/10 p-4"
          >
            {user ? (
              <>
                <div className="pb-3 mb-3 border-b border-gray-700">
                  <div className="text-white font-semibold text-lg">{user.username}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
                <div className="flex flex-col gap-2 text-white">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-lg transition"
                  >
                    <User size={18} />
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-lg transition"
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:bg-red-600/80 bg-red-600 px-3 py-2 rounded-lg transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowDropdown(false);
                  location.href = "/login";
                }}
                className="w-full text-left text-white px-3 py-2 rounded-lg hover:bg-purple-700 bg-purple-600 transition"
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
      animate={{
        backgroundColor: isScrolled ? "rgba(0,0,0,0.7)" : undefined,
      }}
      className={`fixed top-0 left-0 w-full py-4 px-6 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md border-b border-gray-700"
          : "bg-gradient-to-b from-black/70 via-black/30 to-transparent"
      }`}
    >
      <Navbar className="bg-transparent">
        <NavbarBrand>
          <Link href="/" className="text-white font-bold text-2xl no-underline hover:no-underline">
            AniTeams
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden md:flex gap-6">
          <NavbarItem>
            <Link href="/" className="text-white">Home</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/about" className="text-white">About</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/search" className="text-white">Search</Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <button onClick={() => setShowSearch(true)} className="text-white">
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </NavbarItem>
          <NavbarItem>
            <AvatarDropdown />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </motion.div>
  );
}
