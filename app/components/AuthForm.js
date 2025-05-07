'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function AuthForm({ type }) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const router = useRouter()

  useEffect(() => {
    const uid = Cookies.get('uid')
    if (uid) router.push('/')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    const payload = { email, password }
    if (type === 'signup') payload.username = username

    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Something went wrong.')

// Set UID cookie here
if (data.uid) {
  Cookies.set('uid', data.uid, { expires: 7 })
}

setMessage({ text: data.message || 'Success!', type: 'success' })
setTimeout(() => router.push('/'), 1500)

    } catch (err) {
      setMessage({ text: err.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 p-6 rounded-2xl shadow-2xl space-y-4"
      >
        <AnimatePresence>
          {message.text && (
            <motion.div
              key="banner"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white mb-4 ${
                message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-white text-xl font-semibold text-center">
          {type === 'login' ? 'Login' : 'Create Account'}
        </h2>

        {type === 'signup' && (
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 bg-zinc-800 text-white rounded-md focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-zinc-800 text-white rounded-md focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-zinc-800 text-white rounded-md focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-9 flex items-center justify-center bg-purple-600 hover:bg-purple-700 transition rounded-md text-white font-semibold ${
            loading ? 'opacity-70' : ''
          }`}
        >
          {loading ? (
            <span
              dangerouslySetInnerHTML={{
                __html: `<svg width="24" height="24" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_V8m1{transform-origin:center;animation:spinner_zKoa 2s linear infinite}.spinner_V8m1 circle{stroke-linecap:round;animation:spinner_YpZS 1.5s ease-in-out infinite}@keyframes spinner_zKoa{100%{transform:rotate(360deg)}}@keyframes spinner_YpZS{0%{stroke-dasharray:0 150;stroke-dashoffset:0}47.5%{stroke-dasharray:42 150;stroke-dashoffset:-16}95%,100%{stroke-dasharray:42 150;stroke-dashoffset:-59}}</style><g class="spinner_V8m1"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle></g></svg>`,
              }}
            />
          ) : type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}
