import { db } from '../../lib/firebaseAdmin'

export async function POST(req) {
  try {
    const { uid, animeId, title, image, status } = await req.json()

    if (!uid || !animeId || !status) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 })
    }

    const userWatchlistRef = db.collection('watchlists').doc(uid)
    const docSnap = await userWatchlistRef.get()

    // Default watchlist structure
    let currentWatchlist = {
      watching: [],
      planning: [],
      completed: [],
      dropped: [],
    }

    if (docSnap.exists) {
      // Load existing data
      currentWatchlist = docSnap.data()

      // Overwrite behavior: remove anime from all categories
      for (const key of Object.keys(currentWatchlist)) {
        currentWatchlist[key] = currentWatchlist[key].filter(item => item.animeId !== animeId)
      }
    }

    // Make sure the status list exists (just in case)
    if (!Array.isArray(currentWatchlist[status])) {
      currentWatchlist[status] = []
    }

    // Add anime to the selected category
    currentWatchlist[status].push({ animeId, title, image })

    // Save the updated watchlist (creates the document if it doesn't exist)
    await userWatchlistRef.set(currentWatchlist)

    return new Response(JSON.stringify({ message: 'Anime saved/updated!' }), { status: 200 })
  } catch (error) {
    console.error('Error saving anime:', error)
    return new Response(JSON.stringify({ message: 'Error saving to Firestore' }), { status: 500 })
  }
}
