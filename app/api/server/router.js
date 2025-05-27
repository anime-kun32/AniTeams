
import { NextResponse } from "next/server";
import { HiAnime } from "aniwatch";

const hianime = new HiAnime.Scraper();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get("episodeId");

  if (!episodeId) {
    return NextResponse.json({ error: "Missing episodeId parameter" }, { status: 400 });
  }

  try {
    const data = await hianime.getEpisodeServers(episodeId);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in getEpisodeServers:", error);
    return NextResponse.json(
      {
        status: 500,
        scraper: "getEpisodeServers",
        message: "getEpisodeServers: fetchError: Something went wrong",
      },
      { status: 500 }
    );
  }
}
