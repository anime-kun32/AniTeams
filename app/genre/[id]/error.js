"use client";
import { useEffect, useState } from "react";

export default function GlobalError({ error, reset }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Backup the original console methods
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    // Override console methods to capture logs
    console.log = (...args) => {
      originalConsoleLog(...args); // Still log to the original console
      setLogs((prevLogs) => [...prevLogs, { type: "log", message: args.join(" ") }]);
    };

    console.error = (...args) => {
      originalConsoleError(...args); // Still log to the original console
      setLogs((prevLogs) => [...prevLogs, { type: "error", message: args.join(" ") }]);
    };

    console.warn = (...args) => {
      originalConsoleWarn(...args); // Still log to the original console
      setLogs((prevLogs) => [...prevLogs, { type: "warn", message: args.join(" ") }]);
    };

    console.info = (...args) => {
      originalConsoleInfo(...args); // Still log to the original console
      setLogs((prevLogs) => [...prevLogs, { type: "info", message: args.join(" ") }]);
    };

    // Cleanup the overridden methods when the component is unmounted
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.info = originalConsoleInfo;
    };
  }, []);

  useEffect(() => {
    console.error("Client-side error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold">Application Error</h1>
        <p className="text-gray-400 mt-2">Something went wrong.</p>

        {error.message && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left overflow-auto">
            <pre className="text-red-400">{error.message}</pre>
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left overflow-auto">
          <h2 className="text-xl font-bold">Console Logs:</h2>
          <div className="text-gray-300 mt-2">
            {logs.map((log, index) => (
              <div key={index} className={`text-${log.type === "error" ? "red" : log.type === "warn" ? "yellow" : "gray"}-400`}>
                [{log.type.toUpperCase()}]: {log.message}
              </div>
            ))}
          </div>
        </div>

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