import { NextResponse } from 'next/server'
import { db } from '@lib/firebaseAdmin'

export async function POST(req) {
  try {
    const { uid } = await req.json()

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userDoc = await db.collection('users').doc(uid).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: userDoc.data() }, { status: 200 })
  } catch (err) {
    console.error('[ACCOUNT_FETCH_ERROR]', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch user info' }, { status: 400 })
  }
}
