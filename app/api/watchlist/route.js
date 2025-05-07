import { db } from '@lib/firebaseAdmin'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get('uid')

    if (!uid) {
      return new Response(JSON.stringify({ message: 'Missing UID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const userWatchlistRef = db.collection('watchlists').doc(uid)
    const docSnap = await userWatchlistRef.get()

    if (!docSnap.exists) {
      return new Response(JSON.stringify({ message: 'No watchlist found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = docSnap.data()

    return new Response(JSON.stringify({ watchlist: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    return new Response(JSON.stringify({ message: 'Error fetching from Firestore' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
