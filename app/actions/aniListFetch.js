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
              role
            }
          }
        }
      }
    }
  `;

  try {
    console.log(`Fetching data for animeId: ${animeId} from AniList API`);

    // Make the API request to AniList
    const res = await fetch(ANI_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: API_QUERY,
        variables: { id: animeId },
      }),
    });

    // Log if the response is not successful
    if (!res.ok) {
      console.error(`Error while fetching anime data: ${res.status}`);
      throw new Error(`Anime data fetch error: ${res.status}`);
    }

    // Parse the response JSON
    const data = await res.json();

    // Ensure the structure is correct
    if (!data || !data.data || !data.data.Media) {
      console.error("Invalid response structure");
      throw new Error("Invalid response structure");
    }

    console.log(`Successfully fetched data for animeId: ${animeId}`);

    // Return the anime data
    return data.data.Media;
  } catch (error) {
    // Log the error if something goes wrong
    console.error("Failed to fetch anime data:", error);
    return null;
  }
}
