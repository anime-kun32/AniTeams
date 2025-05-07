"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Use usePathname for route changes
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress styles
NProgress.configure({
  trickleSpeed: 200,
  minimum: 0.1,
  showSpinner: false, // Hide spinner (optional)
});

export default function PageTransition({ children }) {
  const pathname = usePathname(); // Get current pathname

  useEffect(() => {
    NProgress.start(); // Start progress bar on route change

    // End progress bar when the route change is complete
    NProgress.done(); // Immediately end the progress bar

    return () => {
      NProgress.done(); // Ensure progress bar is stopped on unmount
    };
  }, [pathname]); // Run effect on pathname change

  return <>{children}</>; // Render children components
}
