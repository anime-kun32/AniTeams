"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  WrenchIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

const FloatingIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const uid = Cookies.get("uid");
    setIsAuthenticated(!!uid);
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("uid");
    router.refresh();
  };

  return (
    <div className="md:hidden fixed bottom-5 right-5 z-50">
      <div className="relative">
        {/* Main Icon */}
        <button
          onClick={toggleMenu}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
        >
          <WrenchIcon className="h-6 w-6" />
        </button>

        {/* Menu Options */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white shadow-lg rounded-lg p-3 flex flex-col gap-3 w-48 transition-all duration-300">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => router.push("/account")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <UserIcon className="h-5 w-5" />
                  My Profile
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <HomeIcon className="h-5 w-5" />
                  Home
                </button>
                <button
                  onClick={() => router.push("/search")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Search
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-600"
                >
                  <UserIcon className="h-5 w-5" />
                  Sign In
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <HomeIcon className="h-5 w-5" />
                  Home
                </button>
                <button
                  onClick={() => router.push("/search")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Search
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingIcon;
