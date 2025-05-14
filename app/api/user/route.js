import { cookies } from 'next/headers'
import { db } from '@lib/firebaseAdmin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const uid = cookies().get('uid')?.value
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { username, profilePic } = userDoc.data()
    return NextResponse.json({ username, profilePic }, { status: 200 })
  } catch (err) {
    console.error('[USER_FETCH_ERROR]', err)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
