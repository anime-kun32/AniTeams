import { NextResponse } from 'next/server'
import { auth, db } from '../../../lib/firebaseAdmin' 

export async function POST(req) {
  try {
    const { email, password, username } = await req.json()

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    })

    const uid = userRecord.uid

    await db.collection('users').doc(uid).set({
      uid,
      email,
      username,
      avatar: '/avatars/default1.png',
      createdAt: new Date().toISOString(),
    })

    await db.collection('notifications').doc(uid).set({ list: [] })

    const base = db.collection('watchlist').doc(uid)
    const types = ['watching', 'planning', 'completed', 'dropped']
    await Promise.all(
      types.map(type => base.collection(type).doc('_init').set({ created: true }))
    )

    return NextResponse.json({ success: true, uid }, { status: 201 })
  } catch (err) {
    console.error('[SIGNUP_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 400 })
  }
}
