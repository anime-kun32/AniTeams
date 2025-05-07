'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import WatchlistSection from './WatchlistTabs'
import ConnectToAnilistButton from '@components/sync/ConnectToAnilistButton'
import ResumeWatching from '@components/ResumeWatching'

const avatarList = [
"https://cdn.noitatnemucod.net/avatar/100x100/demon_splayer/File15.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/jujutsu_kaisen/File1.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-01.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-02.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-03.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-04.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-05.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-06.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-07.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_normal/av-zz-08.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/01.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/02.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/03.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/04.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/05.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/06.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/chainsaw/07.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar-10.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar-11.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar-12.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar2-01.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar2-02.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar2-03.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/zoro_chibi/avatar2-04.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/user-10.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/user-11.jpeg",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/03.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/04.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/05.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/18.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/File1.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/one_piece/File2.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/spy_family/06.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/spy_family/07.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/spy_family/08.png",
    "https://cdn.noitatnemucod.net/avatar/100x100/tha/12.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/tha/13.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/tha/15.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/tha/16.jpg",
    "https://cdn.noitatnemucod.net/avatar/100x100/tha/17.jpg",
]

export default function AccountPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState(null)
  const [changing, setChanging] = useState(false)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  useEffect(() => {
    const userId = Cookies.get('uid')
    setUid(userId)

    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: userId }),
        })

        const data = await res.json()
        if (data.success) {
          setUser(data.user)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const changeAvatar = async (url) => {
    setChanging(true)
    try {
      const res = await fetch('/api/change-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, avatar: url }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(prev => ({ ...prev, avatar: url }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setChanging(false)
      setShowAvatarPicker(false)
    }
  }

  if (!uid && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">You're not logged in</h1>
          <p className="text-zinc-400">Please sign in to access your account dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white px-4 p-20 py-12">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="w-24 h-24 bg-zinc-700 rounded-full mx-auto" />
            <div className="h-6 bg-zinc-700 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-zinc-700 rounded w-1/3 mx-auto" />
          </div>
        ) : user ? (
          <>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 border-b border-zinc-800 pb-10">
              <div className="relative group">
                <button onClick={() => setShowAvatarPicker(true)} className="relative">
                  <Image
                    src={user.avatar || '/avatars/default1.png'}
                    alt="User Avatar"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-zinc-800 shadow-lg transition hover:opacity-80"
                  />
                  {changing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </button>
                <p className="text-xs text-zinc-500 mt-2 text-center">Click to change avatar</p>
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-3xl font-semibold">{user.username}</h2>
                <p className="text-zinc-400">{user.email}</p>
                <p className="text-sm text-zinc-500">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAvatarPicker(false)}
                >
                  <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="bg-zinc-900 rounded-2xl p-6 max-w-4xl w-full shadow-lg overflow-y-auto max-h-[80vh]"
                  >
                    <h3 className="text-xl font-bold mb-4">Choose Your Avatar</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-4">
                      {avatarList.map((url, i) => (
                        <Image
                          key={i}
                          src={url}
                          alt={`Avatar ${i}`}
                          width={64}
                          height={64}
                          className="rounded-full cursor-pointer hover:scale-105 transition border-2 border-transparent hover:border-white"
                          onClick={() => changeAvatar(url)}
                        />
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="my-10">
              <ResumeWatching />
            </div>

            <div className="my-10">
              <WatchlistSection />
            </div>

            <div className="mt-8 flex justify-center">
              <ConnectToAnilistButton className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 px-6 rounded-lg shadow-md transform transition duration-200 hover:scale-105" />
            </div>
          </>
        ) : (
          <>
            <p>Rendering ConnectToAnilistButton below</p>
            <ConnectToAnilistButton className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 px-6 rounded-lg shadow-md transform transition duration-200 hover:scale-105" />
          </>
        )}
      </div>
    </div>
  )
}
