"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../Header";
import Footer from "../Footer";
import FloatingIcon from "../FloatingIcon";
import PageTransition from "../page_transition";

export default function ClientLayoutWrapper({ children }) {
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the installation prompt");
        } else {
          console.log("User dismissed the installation prompt");
        }
        setShowInstallBanner(false);
        setDeferredPrompt(null);
      });
    }
  };

  const handleDismissBanner = () => {
    setShowInstallBanner(false);
  };

  return (
    <>
      <Header />
      <PageTransition>{children}</PageTransition>
      <FloatingIcon />
      <Footer />

      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-black text-white py-3 px-4 flex justify-between items-center z-50"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <span>Install the AniTeams app for a better experience!</span>
            <div className="flex space-x-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleInstallClick}
              >
                Install
              </button>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={handleDismissBanner}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
