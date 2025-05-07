'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import jsCookie from 'js-cookie'
import { motion, AnimatePresence } from 'framer-motion'
import EpisodeGuide from '@components/details/EpisodeGuide'
import CharacterVoiceStaff from '@components/CharacterVoiceStaff'

const AnimeDetails = () => {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedList, setSelectedList] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchAnimeDetails = async () => {
      const primaryUrl = `${process.env.NEXT_PUBLIC_CONSUMET_BASE_URL}/meta/anilist/data/${id}`
      const fallbackUrl = `https://hianime-mapper-iv3g.vercel.app/anime/info/${id}`

      try {
        let response = await fetch(primaryUrl)
        if (!response.ok) throw new Error('Primary API failed')
        const data = await response.json()
        setAnime(data)
      } catch {
        try {
          let fallbackResponse = await fetch(fallbackUrl)
          const fallbackData = await fallbackResponse.json()
          setAnime(fallbackData.data)
        } catch {}
      } finally {
        setLoading(false)
      }
    }

    const checkExistingStatus = async () => {
      const uid = jsCookie.get('uid')
      if (!uid || !id) return

      try {
        const res = await fetch('/api/checkStatus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ animeId: id }),
        })
        const { status } = await res.json()
        if (status) setSelectedList(status)
      } catch (err) {
        console.error('Failed to check bookmark status', err)
      }
    }

    fetchAnimeDetails()
    checkExistingStatus()
  }, [id])

  const handleSelectList = async (list) => {
  setSelectedList(list)
  setSubmitting(true)
  setDropdownOpen(false)

  const uid = jsCookie.get('uid')

  if (!uid) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []
    const filtered = bookmarks.filter(item => item.id !== anime.id)
    filtered.push({
      id: anime.id,
      title: anime.title?.english || anime.title?.romaji,
      image: anime.image,
      status: list
    })
    localStorage.setItem('bookmarks', JSON.stringify(filtered))
    setSubmitting(false)
    setSuccessMessage('Anime Saved!')
    setTimeout(() => setSuccessMessage(false), 2000) // hide after 2 seconds
    return
  }

  try {
    const res = await fetch('/api/saveBookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        animeId: anime.id,
        title: anime.title?.english || anime.title?.romaji,
        image: anime.image,
        status: list,
      }),
    })

    if (res.ok) {
      const { message } = await res.json()
      if (message === 'Anime Saved!') {
        setSuccessMessage('Anime Saved!')
        setTimeout(() => setSuccessMessage(false), 2000) // hide after 2 seconds
      }
    } else {
      throw new Error('Failed to save anime')
    }
  } catch (error) {
    console.error('Error saving anime to Firestore:', error)
  } finally {
    setSubmitting(false)
  }
}


  return (
    <div className="bg-black text-white min-h-screen">
      {loading ? <SkeletonLoader /> : anime ? (
        <AnimeContent
          anime={anime}
          id={id}
          handleSelectList={handleSelectList}
          selectedList={selectedList}
          submitting={submitting}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          successMessage={successMessage}
        />
      ) : (
        <ErrorMessage />
      )}
    </div>
  )
}

const SkeletonLoader = () => (
  <div className="animate-pulse p-4">
    <div className="h-80 bg-gray-800 rounded w-full mb-5"></div>
    <div className="container mx-auto px-4 -mt-40">
      <div className="h-[28rem] w-48 bg-gray-700 rounded shadow-lg mb-4"></div>
      <div className="h-10 w-3/4 bg-gray-700 rounded mb-2"></div>
      <div className="h-8 w-1/2 bg-gray-700 rounded mb-4"></div>
      <div className="flex space-x-2 mb-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-6 w-20 bg-gray-700 rounded" />)}
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-4 w-full bg-gray-700 rounded" />)}
      </div>
    </div>
  </div>
)

const AnimeContent = ({ anime, id, handleSelectList, selectedList, submitting, dropdownOpen, setDropdownOpen, successMessage }) => {
  const title = anime.title?.english || anime.title?.romaji || 'Unknown Title'
  const coverImage = anime.image || '/default-cover.jpg'
  const options = ['watching', 'planning', 'completed', 'dropped']

  const spinner = (
    <svg width="20" height="20" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`.spinner { transform-origin: center; animation: spin 2s linear infinite; }
        .spinner circle { stroke-linecap: round; animation: dash 1.5s ease-in-out infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes dash {
          0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 42 150; stroke-dashoffset: -16; }
          100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; }
        }`}
      </style>
      <g className="spinner">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" stroke="white" />
      </g>
    </svg>
  )

  return (
    <>
      <div className="banner relative h-80 w-full bg-cover bg-center" style={{ backgroundImage: `url(${anime.cover})` }}>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-40">
        <img src={coverImage} alt={title} className="rounded shadow-lg w-48 h-[28rem] object-cover" />
      </div>

      <div className="container mx-auto px-4 mt-5">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-2xl text-gray-400">{anime.title?.native || 'Unknown Native Name'}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {anime.genres?.map((g, i) => <span key={i} className="bg-gray-700 px-3 py-1 rounded text-sm">{g}</span>)}
        </div>

        <div className="mt-4 text-gray-400 space-y-1">
  <p>{`${anime.type || 'Unknown'} | ${anime.totalEpisodes || 'N/A'} Episodes | ${anime.duration || 'N/A'} min`}</p>
  <p>Rating: {anime.rating || 'N/A'}%</p>
  <p>Studio: {anime.studios?.[0] || 'Unknown'}</p>
  <p>Season: {anime.season} {anime.startDate?.year || 'Unknown'}</p>
  <p>Status: {anime.status}</p>
</div>

{anime.description && (
  <div
    className="mt-4 text-gray-300 prose prose-invert max-w-none"
    dangerouslySetInnerHTML={{ __html: anime.description }}
  />
)}


        <div className="mt-4" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="relative w-64">
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 text-left flex items-center justify-between">
              {selectedList ? selectedList.charAt(0).toUpperCase() + selectedList.slice(1) : 'Select List'}
              {submitting && selectedList && <span className="ml-2">{spinner}</span>}
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  className="absolute mt-1 w-full bg-gray-900 rounded border border-gray-700 z-10 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {options.map((option) => (
                    <li
                      key={option}
                      className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${selectedList === option ? 'bg-gray-700' : ''}`}
                      onClick={() => handleSelectList(option)}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {successMessage && (
          <motion.div
            className="absolute top-0 right-0 p-4 bg-green-600 text-white rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Done!
          </motion.div>
        )}

        <div className="mt-4">
          <EpisodeGuide animeId={id} />
        </div>

        <div className="mt-4">
          <CharacterVoiceStaff animeId={id} />
        </div>

        {anime.trailer?.id && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold">Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${anime.trailer.id}`}
              className="rounded-lg w-full h-64 mt-2"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </>
  )
}

const ErrorMessage = () => (
  <div className="text-center text-red-500 mt-10">Anime not found</div>
)

export default AnimeDetails
