import { cookies } from 'next/headers'
import { db } from '@lib/firebaseAdmin'

export async function POST(req) {
  try {
    const { animeId, uid: bodyUid } = await req.json()

    const cookieUid = cookies().get('uid')?.value
    const uid = bodyUid || cookieUid

    if (!uid || animeId == null) {
      return new Response(JSON.stringify({ status: null }), { status: 400 })
    }

    const docRef = db.collection('watchlists').doc(uid)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return new Response(JSON.stringify({ status: null }), { status: 200 })
    }

    const data = docSnap.data()
    const allLists = ['watching', 'planning', 'completed', 'dropped']

    for (const list of allLists) {
      const listItems = data[list] || []
      const found = listItems.some(item => Number(item.animeId) === Number(animeId))
      if (found) {
        return new Response(JSON.stringify({ status: list }), { status: 200 })
      }
    }

    return new Response(JSON.stringify({ status: null }), { status: 200 })
  } catch (err) {
    console.error('Error checking watchlist status:', err)
    return new Response(JSON.stringify({ status: null }), { status: 500 })
  }
}
