import { NextResponse } from "next/server";
import { META, ANIME } from "@consumet/extensions";

const anilist = new META.Anilist(new ANIME.Zoro());

export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const animeId = searchParams.get("animeId");

  if (!animeId) {
    return NextResponse.json({ error: "Missing animeId" }, { status: 400 });
  }

  try {
    // Fetch the mappings from Ani.zip
    const api2Res = await fetch(`https://api.ani.zip/mappings?anilist_id=${animeId}`);
    const api2Data = await api2Res.json();

    if (!api2Data?.episodes) {
      return NextResponse.json({ error: "Invalid response from API 2" }, { status: 500 });
    }

    // Instead of fetching from external URL, get anime info via consumet/extensions
    let newApiData = null;
    try {
      newApiData = await anilist.fetchAnimeInfo(animeId);
    } catch (err) {
      // If consumet fetch fails, just proceed with null to trigger fallback
      newApiData = null;
    }

    if (newApiData && Array.isArray(newApiData.episodes)) {
      const mergedData = newApiData.episodes.map((ep) => {
        let episodeId = ep.id;
        if (episodeId?.includes("$episode$")) {
          const [slug, episodePart] = episodeId.split("$episode$");
          episodeId = `${slug}?ep=${episodePart}`;
        }

        const detailsFromApi2 = api2Data.episodes[ep.number] || {};

        return {
          episodeId,
          title: ep.title || detailsFromApi2.title?.en || `Episode ${ep.number}`,
          synopsis: detailsFromApi2.summary || "No synopsis available.",
          image: detailsFromApi2.image || "/placeholder.jpg",
          airDate: ep.createdAt || detailsFromApi2.airDate || "Unknown Air Date",
          number: ep.number,
        };
      });

      return NextResponse.json({ episodes: mergedData });
    }

    // Fallback fetch for legacy API if consumet fetch failed or no episodes
    const res1 = await fetch(`${process.env.NEXT_PUBLIC_HIANIME_MAPPER_URL}/anime/info/${animeId}`);
    const api1Data = await res1.json();

    if (!Array.isArray(api1Data?.data?.episodesList)) {
      return NextResponse.json({ error: "Invalid response from API 1" }, { status: 500 });
    }

    const mergedData = api1Data.data.episodesList.map((episode) => {
      const detailsFromApi2 = api2Data.episodes[episode.number] || {};

      return {
        episodeId: episode.id,
        title: detailsFromApi2.title?.en || `Episode ${episode.number}`,
        synopsis: detailsFromApi2.summary || "No synopsis available.",
        image: detailsFromApi2.image || "/placeholder.jpg",
        airDate: detailsFromApi2.airDate || "Unknown Air Date",
        number: episode.number,
      };
    });

    return NextResponse.json({ episodes: mergedData });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch episode data" }, { status: 500 });
  }
}
