import { NextResponse } from 'next/server';
import { HiAnime } from 'aniwatch';

const hianime = new HiAnime.Scraper();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const server = searchParams.get('server');
  const category = searchParams.get('category'); // This will be passed as "type" to aniwatch

  if (!id || !server || !category) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
  }

  try {
    const data = await hianime.getEpisodeSources(id, server, category); // category = type
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get episode sources:", error);
    return NextResponse.json({ error: "Failed to fetch episode sources" }, { status: 500 });
  }
}
