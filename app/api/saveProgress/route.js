import { db } from '@lib/firebaseAdmin'

export async function POST(req) {
  try {
    const { uid, animeId, anilistId, totalDuration, current } = await req.json()

    if (!uid || !animeId || !anilistId || !totalDuration || current == null) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 })
    }

    const progressRef = db.collection('progress').doc(uid)

    const animeProgress = {
      [animeId]: {
        animeId,
        anilistId,
        totalDuration,
        current,
        updatedAt: Date.now(),
      },
    }

    await progressRef.set(animeProgress, { merge: true })

    return new Response(JSON.stringify({ message: 'Progress saved successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error saving progress:', error)
    return new Response(JSON.stringify({ message: 'Error saving progress' }), { status: 500 })
  }
}
