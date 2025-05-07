import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const server = searchParams.get('server');
  const category = searchParams.get('category');

  if (!id || !server || !category) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  }

  try {
    const externalUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/hianime/episode/sources?animeEpisodeId=${id}&server=${server}&category=${category}`;
    const res = await fetch(externalUrl);
    const data = await res.json();

    // Just pass through the response directly
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Player API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
