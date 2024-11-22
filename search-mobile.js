
const API_URL = "https://aniwatch-api-net.vercel.app/api/v2/hianime/search/suggestion"; // replace with your deployed api url
const suggestionsList = document.getElementById("suggestions-list");

async function fetchSuggestions(event) {
  const searchTerm = event.target.value.trim();

  // Clear suggestions if the search term is empty
  if (!searchTerm) {
    suggestionsList.innerHTML = "";
    return;
  }

  try {
    // Fetch data from the API
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    // Check if the API response is valid
    if (data.success && data.data.suggestions) {
      renderSuggestions(data.data.suggestions);
    } else {
      suggestionsList.innerHTML = "<li>No results found</li>";
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    suggestionsList.innerHTML = "<li>Error loading suggestions</li>";
  }
}

function renderSuggestions(suggestions) {
  suggestionsList.innerHTML = suggestions
    .map((s) => {
      return `
        <li>
          <a href="details.html?id=${s.id}">
            <img src="${s.poster}" alt="${s.name}">
            <div class="info">
              <div class="title">${s.name}</div>
              <div class="subtitle">${s.jname}</div>
              <div class="more-info">
                <i class="fa fa-calendar"></i> ${s.moreInfo[0]}
                <i class="fa fa-film"></i> ${s.moreInfo[1]}
                <i class="fa fa-clock"></2]}
              </div>
            </div>
          </a>
        </li>
      `;
    })
    .join("");
}
