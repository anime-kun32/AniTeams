"use client";
import { useEffect, useState } from "react";

export default function GlobalError({ error, reset }) {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.error("Client-side error:", error);
    setErrorMessage(error.message);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold">Application Error</h1>
        <p className="text-gray-400 mt-2">Something went wrong.</p>

        {errorMessage && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left overflow-auto">
            <pre className="text-red-400">{errorMessage}</pre>
          </div>
        )}

        <button
          onClick={() => reset()}
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
