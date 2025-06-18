// app/api/animepahe/episodes/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
  
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
        status: 400,
      });
    }
  
    const externalApiUrl = `https://no-drab.vercel.app/anime/animepahe/info/${id}`;
  
    try {
      const response = await fetch(externalApiUrl);
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
          status: 500,
        });
      }
  
      const data = await response.json();
      const episodes = data.episodes || [];
  
      return Response.json(episodes);
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Something went wrong' }), {
        status: 500,
      });
    }
  }
  