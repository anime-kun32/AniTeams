import { NextResponse } from 'next/server'
import { db } from '@lib/firebaseAdmin'
import { decodeJwt } from 'jose'

export async function POST(req) {
  try {
    const { uid, token } = await req.json()

    if (!uid || !token) {
      return NextResponse.json({ error: 'Missing uid or token' }, { status: 400 })
    }

    // Decode the JWT token using jose (decodeJwt returns the payload directly)
    const { sub } = await decodeJwt(token)

    if (!sub) {
      return NextResponse.json({ error: 'Missing sub in token payload' }, { status: 400 })
    }

    await db.collection('users').doc(uid).update({
      anilistSub: sub,
    })

    return NextResponse.json({ success: true, sub }, { status: 200 })
  } catch (error) {
    console.error('Error in POST /anilist-sub:', error) // Log the actual error
    return NextResponse.json({ error: 'Error decoding token or saving sub' }, { status: 500 })
  }
}
