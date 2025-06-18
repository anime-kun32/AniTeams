import { NextResponse } from 'next/server'
import { auth } from '../../../lib/firebaseAdmin' 

export async function POST(req) {
  try {
    const { email } = await req.json()

    const user = await auth.getUserByEmail(email)

    return NextResponse.json({ success: true, uid: user.uid }, { status: 200 })
  } catch (err) {
    console.error('[LOGIN_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 400 })
  }
}
