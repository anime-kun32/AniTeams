export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">About AniTeams</h1>
        <p className="mb-4">
          AniTeams is a free anime streaming site made for fans, by a fan. No ads, no fees — just anime.
        </p>
        <a
          href="https://github.com/anime-kun32"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Built by anime-kun32
        </a>
      </div>
    </div>
  );
}
