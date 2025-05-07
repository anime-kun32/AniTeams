"use client";
import { useEffect } from "react";

const Eruda = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.eruda) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/eruda";
      script.async = true;
      script.onload = () => {
        window.eruda.init();
      };
      document.body.appendChild(script);
    }
  }, []);

  return null; // No UI needed
};

export default Eruda;
