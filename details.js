const urlParams = new URLSearchParams(window.location.search);
const animeId = urlParams.get("id") || "defaultAnimeId";
const apiUrl = `https://aniwatch-api-net.vercel.app/api/v2/hianime/anime/${animeId}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    const anime = data?.data?.anime?.info;
    const moreInfo = data?.data?.anime?.moreInfo;

    if (!anime || !moreInfo) {
      console.error("Invalid API response structure:", data);
      alert("Failed to load anime details. Please try again later.");
      return;
    }

    // Set page title
    document.title = anime.name || "Anime Details";

    // Set dynamic background image
    if (anime.poster) {
      document.body.style.backgroundImage = `url('${anime.poster}')`;
    }

    // Populate anime details
    document.getElementById("poster").src = anime.poster || "";
    document.getElementById("animeTitle").textContent = anime.name || "Unknown Title";
    document.getElementById("rating").textContent = anime.stats?.rating || "N/A";
    document.getElementById("sub").textContent = anime.stats?.episodes?.sub
      ? `${anime.stats.episodes.sub} Sub`
      : "N/A";
    document.getElementById("dub").textContent = anime.stats?.episodes?.dub
      ? `${anime.stats.episodes.dub} Dub`
      : "N/A";

    const descText = document.getElementById("descText");
    const readToggle = document.getElementById("readToggle");
    const fullDescription = anime.description || "No description available.";
    let isExpanded = false;

    const truncateText = (text, limit) =>
      text.split(" ").slice(0, limit).join(" ") + "...";

    descText.textContent = truncateText(fullDescription, 10);
    readToggle.textContent = "Read More";

    readToggle.addEventListener("click", () => {
      isExpanded = !isExpanded;
      descText.textContent = isExpanded
        ? fullDescription
        : truncateText(fullDescription, 10);
      readToggle.textContent = isExpanded ? "Read Less" : "Read More";
    });

    // More Info Section
    document.getElementById("japanese").textContent = moreInfo.japanese || "N/A";
    document.getElementById("synonyms").textContent = moreInfo.synonyms || "N/A";
    document.getElementById("aired").textContent = moreInfo.aired || "N/A";
    document.getElementById("status").textContent = moreInfo.status || "N/A";
    document.getElementById("genres").textContent =
      moreInfo.genres?.join(", ") || "N/A";
    document.getElementById("studios").textContent = moreInfo.studios || "N/A";

    // Watch Now Button
    const watchNowButton = document.getElementById("watchNow");
    watchNowButton.href = `watch.html?id=${animeId}`;

    // Bookmark Button
    const bookmarkButton = document.getElementById("bookmark");
    bookmarkButton.addEventListener("click", () => {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      if (!bookmarks.includes(animeId)) {
        bookmarks.push(animeId);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        alert(`${anime.name || "This anime"} bookmarked!`);
      } else {
        alert("Already bookmarked!");
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching anime details:", error);
    alert("Failed to fetch anime details. Please try again later.");
  });
                                
