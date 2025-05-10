'use client'

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '@components/AuthForm'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const uid = Cookies.get('uid')
    if (uid) router.push('/')
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 text-white">
      <AuthForm type="login" />
      
      <p className="mt-6 text-sm text-gray-400">
        No account?{' '}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
