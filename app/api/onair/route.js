export async function POST() {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59));

  const query = {
    query: `
      query ($start: Int, $end: Int) {
        Page(perPage: 50) {
          airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
            id
            airingAt
            timeUntilAiring
            episode
            mediaId
            media {
              id
              title {
                romaji
                english
              }
              episodes
            }
          }
        }
      }
    `,
    variables: {
      start: Math.floor(startOfDay.getTime() / 1000),
      end: Math.floor(endOfDay.getTime() / 1000),
    },
  };

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });

    const data = await res.json();
    const schedules = data?.data?.Page?.airingSchedules || [];

    return new Response(JSON.stringify(schedules), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error("AniList query failed:", err);
    return new Response(JSON.stringify({ error: 'AniList fetch failed' }), {
      status: 500,
    });
  }
}
