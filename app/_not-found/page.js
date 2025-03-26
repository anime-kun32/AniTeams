// app/_not-found/page.js

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-center">404</h1>
      <p className="text-xl mt-4">Oops! The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="mt-6 text-blue-500 hover:text-blue-300 text-lg font-semibold transition-all"
      >
        Go back to Home
      </a>
    </div>
  );
}
