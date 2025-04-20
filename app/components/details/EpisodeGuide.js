import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const animeId = searchParams.get("animeId");

  if (!animeId) {
    return NextResponse.json({ error: "Missing animeId" }, { status: 400 });
  }

  try {
    // Try new API first
    const newApiRes = await fetch(`https://no-drab.vercel.app/meta/anilist/info/${animeId}`);
    if (newApiRes.ok) {
      const newApiData = await newApiRes.json();
      const mergedData = newApiData.episodes.map((ep) => {
        let episodeId = ep.id;
        if (episodeId?.includes("$episode$")) {
          const [slug, episodePart] = episodeId.split("$episode$");
          episodeId = `${slug}?ep=${episodePart}`;
        }

        return {
          episodeId,
          title: ep.title || `Episode ${ep.number}`,
          synopsis: ep.description || "No synopsis available.",
          image: ep.image || "/placeholder.jpg",
          airDate: ep.createdAt || "Unknown Air Date",
          number: ep.number,
        };
      });

      return NextResponse.json({ episodes: mergedData });
    }

    // Fallback to old API if new one fails
    const [res1, res2] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_HIANIME_MAPPER_URL}/anime/info/${animeId}`),
      fetch(`https://api.ani.zip/mappings?anilist_id=${animeId}`),
    ]);

    const api1Data = await res1.json();
    const api2Data = await res2.json();

    if (!Array.isArray(api1Data?.data?.episodesList) || !api2Data?.episodes) {
      return NextResponse.json({ error: "Invalid response from fallback APIs" }, { status: 500 });
    }

    const mergedData = api1Data.data.episodesList.map((episode) => {
      const details = api2Data.episodes[episode.number] || {};
      return {
        episodeId: episode.id,
        title: details.title?.en || `Episode ${episode.number}`,
        synopsis: details.overview || "No synopsis available.",
        image: details.image || "/placeholder.jpg",
        airDate: details.airDate || "Unknown Air Date",
        number: episode.number,
      };
    });

    return NextResponse.json({ episodes: mergedData });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch episode data" }, { status: 500 });
  }
}
