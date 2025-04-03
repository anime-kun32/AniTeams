"use server";

export async function fetchAnimeData(animeId) {
  const ANI_GRAPHQL_URL = "https://graphql.anilist.co";
  const API_QUERY = `
    query ($id: Int) {
      Media(id: $id) {
        characters(perPage: 10) {
          edges {
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
            voiceActors(language: JAPANESE) {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
        staff(perPage: 5) {
          edges {
            node {
              id
              name {
                full
              }
              image {
                large
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log(`Preparing to fetch data for animeId: ${animeId}`);

    const res = await fetch(ANI_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        query: API_QUERY,
        variables: { id: animeId },
      }),
    });

    console.log(`Fetch request sent to ${ANI_GRAPHQL_URL} with animeId: ${animeId}`);

    if (!res.ok) {
      console.error(`Error: Received status code ${res.status}`);
      throw new Error(`Anime data fetch error: ${res.status}`);
    }

    const data = await res.json();
    console.log("Received data:", data);

    if (!data?.data?.Media) {
      console.error("Error: Invalid response structure");
      throw new Error("Invalid response structure");
    }

    return data.data.Media;
  } catch (error) {
    console.error("Failed to fetch anime data:", error);
    return null;
  }
}
