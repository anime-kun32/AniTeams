export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const anilistId = searchParams.get("id");

  if (!anilistId) {
    return new Response(JSON.stringify({ error: "Missing id parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  function normalize(str) {
    return str?.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
  }

  async function getTitlesFromAnilist(id) {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          title {
            romaji
            english
            native
          }
        }
      }
    `;

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id: parseInt(id, 10) },
      }),
    });

    const data = await response.json();
    return data?.data?.Media?.title;
  }

  async function searchAnimepahe(queryTitle) {
    const encoded = encodeURIComponent(queryTitle);
    const response = await fetch(`https://no-drab.vercel.app/anime/animepahe/${encoded}`);
    const data = await response.json();
    return data.results;
  }

  try {
    const titles = await getTitlesFromAnilist(anilistId);
    if (!titles) {
      return new Response(JSON.stringify({ error: "Anime not found on AniList" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const titleList = [titles.romaji, titles.english, titles.native].filter(Boolean);
    const normalizedTitles = titleList.map(normalize);

    // Search with Romaji (or fallback to first available title)
    const searchTitle = titles.romaji || titles.english || titles.native;
    const results = await searchAnimepahe(searchTitle);

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({
        titles,
        match: null,
        message: "No results found on Animepahe"
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try matching any of the title variants
    const match = results.find(r => {
      const animepaheTitle = normalize(r.title);
      return normalizedTitles.some(title => animepaheTitle === title || animepaheTitle.includes(title));
    }) || results[0];

    return new Response(JSON.stringify({
      titles,
      normalizedTitles,
      matchStrategy: normalizedTitles.some(t => normalize(match.title) === t) ? "exact" : "partial/fallback",
      match,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Something went wrong",
      details: err.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
