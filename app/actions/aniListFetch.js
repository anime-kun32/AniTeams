"use server";

// Function to fetch anime data from AniList GraphQL API
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
    console.log(`Preparing to fetch data for animeId: ${animeId}`);

    // Make the API request to AniList
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

    // Check if the response is successful
    if (!res.ok) {
      console.error(`Error: Received status code ${res.status}`);
      throw new Error(`Anime data fetch error: ${res.status}`);
    }

    // Parse the response JSON
    const data = await res.json();

    // Log the received data
    console.log("Received data:", data);

    // Ensure the structure is correct
    if (!data?.data?.Media) {
      console.error("Error: Invalid response structure");
      throw new Error("Invalid response structure");
    }

    // Return the anime data
    return data.data.Media;
  } catch (error) {
    // Log the error if something goes wrong
    console.error("Failed to fetch anime data:", error);
    return null;
  }
}
