import { NextResponse } from 'next/server'

const ANILIST_API_URL = 'https://graphql.anilist.co'

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const sub = url.searchParams.get('sub')

    if (!sub) {
      return NextResponse.json({ error: 'Missing sub' }, { status: 400 })
    }

    const headers = {
      'Content-Type': 'application/json',
    }

    const query = `
      query ($userId: Int) {
        MediaListCollection(userId: $userId, type: ANIME) {
          lists {
            name
            status
            entries {
              media {
                id
                title {
                  romaji
                  english
                  native
                }
                coverImage {
                  large
                }
              }
            }
          }
        }
      }
    `

    const variables = { userId: parseInt(sub) }

    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })

    const text = await response.text()

    let data
    try {
      data = JSON.parse(text)
    } catch (jsonErr) {
      console.error('Failed to parse AniList response JSON:', jsonErr)
      console.error('Raw response text:', text)
      return NextResponse.json({ error: 'Invalid response from AniList' }, { status: 500 })
    }

    if (response.status !== 200 || !data.data) {
      console.error('AniList API error:', data)
      return NextResponse.json({ error: 'Failed to fetch anime list' }, { status: 500 })
    }

    const animeLists = data.data.MediaListCollection.lists.reduce((acc, list) => {
      acc[list.status] = list.entries.map((entry) => ({
        id: entry.media.id, 
        title:
          entry.media.title.romaji ||
          entry.media.title.english ||
          entry.media.title.native,
        coverImage: entry.media.coverImage.large,
      }))
      return acc
    }, {})

    return NextResponse.json({ lists: animeLists })
  } catch (err) {
    console.error('Unhandled error in GET /anilist:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
