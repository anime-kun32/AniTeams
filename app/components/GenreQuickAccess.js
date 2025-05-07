'use client'

import Link from 'next/link'

const genres = [
  { name: 'Action', slug: 'action', image: '/images/action.jpg' },
  { name: 'Romance', slug: 'romance', image: '/images/romance.jpg' },
  { name: 'Sci-Fi', slug: 'sci-fi', image: '/images/sci-fi.jpg' },
  { name: 'Shounen', slug: 'shounen', image: '/images/shounen.jpg' },
  { name: 'Ecchi', slug: 'ecchi', image: '/images/ecchi.jpg' },
{ name: 'Mystery', slug: 'mystery', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101759-8UR7r9MNVpz2.jpg' },

]

export default function GenreQuickAccess() {
  return (
    <div className="w-full px-4 py-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Browse by Genre</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {genres.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${genre.slug}`}
            className="min-w-[120px] h-16 flex items-center justify-center px-4 bg-purple-800 text-white rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 relative overflow-hidden"
          >
            <img
              src={genre.image}
              alt={genre.name}
              className="absolute top-0 left-0 w-full h-full object-cover opacity-40 rounded-lg"
            />
            <span className="relative z-10">{genre.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
