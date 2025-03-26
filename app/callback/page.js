"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchAniListToken } from "../actions/anilist";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      fetchAniListToken(authCode).then((token) => {
        if (token) {
          Cookies.set("anilistAuthToken", token, { expires: 30 });
          router.push("/");
        }
      });
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <p>Logging you in...</p>
      <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
      <script>eruda.init();</script>
    </div>
  );
}
