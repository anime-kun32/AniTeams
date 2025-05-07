
'use client'

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import AuthForm from '../components/AuthForm'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    const uid = Cookies.get('uid')
    if (uid) router.push('/')
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
 

        <AuthForm type="signup" />
    </div>
  )
}
