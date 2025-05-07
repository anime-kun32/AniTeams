'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export default function ConnectToAnilistButton() {
  const [status, setStatus] = useState('idle')

  const handleConnect = async () => {
    const token = Cookies.get('anilistAuthToken')
    const uid = Cookies.get('uid')

    if (!token || !uid) {
      console.warn('Missing token or uid — redirecting to AniList OAuth')

      const clientId = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID
      const redirectUri = `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/callback`
      const oauthUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`

      window.location.href = oauthUrl
      return
    }

    try {
      setStatus('connecting')

      const decoded = jwtDecode(token)
      const sub = decoded.sub

      // Save AniList sub to Firestore
      const saveSubRes = await fetch('/api/anilist/storeSub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token }),
      })

      if (!saveSubRes.ok) {
        console.error('Failed to save sub to Firestore')
        setStatus('idle')
        return
      }

      // Fetch anime list from AniList
      const animeListRes = await fetch(`/api/fetchAnimeList?sub=${sub}`)
      const animeData = await animeListRes.json()

      if (!animeListRes.ok || !animeData || !animeData.lists) {
        console.error('Failed to fetch anime list:', animeData)
        setStatus('idle')
        return
      }

      const mapping = {
        CURRENT: 'watching',
        PLANNING: 'planning',
        COMPLETED: 'completed',
        DROPPED: 'dropped',
      }

      for (const [anilistStatus, entries] of Object.entries(animeData.lists)) {
        const status = mapping[anilistStatus]
        if (!status) continue

        console.log(`Syncing ${entries.length} anime(s) in ${status}...`)

        for (const anime of entries) {
          console.log('Saving:', {
            uid,
            animeId: anime.id,
            title: anime.title,
            image: anime.coverImage,
            status,
          })

          try {
            const res = await fetch('/api/saveBookmark', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid,
                animeId: anime.id,
                title: anime.title,
                image: anime.coverImage,
                status,
              }),
            })

            if (!res.ok) {
              const text = await res.text()
              console.error(`Failed to save anime ID ${anime.id}:`, text)
            }
          } catch (err) {
            console.error(`Error saving anime ID ${anime.id}:`, err)
          }
        }
      }

      setStatus('connected')
      console.log('All anime synced!')
    } catch (err) {
      console.error('Error syncing:', err)
      setStatus('idle')
    }
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition-all"
    >
      {status === 'connected' ? 'Connected!' : status === 'connecting' ? 'Connecting...' : 'Connect to AniList'}
    </button>
  )
} 
