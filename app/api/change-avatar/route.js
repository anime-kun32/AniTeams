import { db } from '@lib/firebaseAdmin'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { uid, avatar } = await req.json()

    await db.collection('users').doc(uid).update({ avatar })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[AVATAR_UPDATE_ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
