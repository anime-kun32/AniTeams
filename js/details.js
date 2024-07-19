document.addEventListener("DOMContentLoaded", () => {
    // Extract the anime ID from the URL
    const params = new URLSearchParams(window.location.search);
    const animeId = params.get('id');
    
    if (!animeId) {
        console.error("Anime ID not found in the URL.");
        return;
    }

    // Fetch anime data from the API
    fetch(`https://example.com/api/anime/${animeId}`) // Replace with the actual API URL
        .then(response => response.json())
        .then(data => {
            const anime = data.anime;
            const info = anime.info;
            const moreInfo = anime.moreInfo;

            // Update document title
            const animeTitle = `${info.name} - Anime`;
            document.title = animeTitle;

            // Update header title
            document.getElementById('anime-title').textContent = info.name;

            // Populate anime card
            document.getElementById('title').textContent = info.name;
            document.getElementById('poster').src = info.poster;
            document.getElementById('description').textContent = info.description;

            // Populate list items
            document.getElementById('japanese').textContent = moreInfo.japanese;
            document.getElementById('synonyms').textContent = moreInfo.synonyms;
            document.getElementById('aired').textContent = moreInfo.aired;
            document.getElementById('premiered').textContent = moreInfo.premiered;
            document.getElementById('duration').textContent = moreInfo.duration;
            document.getElementById('status').textContent = moreInfo.status;
            document.getElementById('malscore').textContent = moreInfo.malscore;
            document.getElementById('studios').textContent = moreInfo.studios;
            document.getElementById('producers').textContent = moreInfo.producers.join(', ');

            // Populate genres
            const genresList = document.createElement('ul');
            moreInfo.genres.forEach(genre => {
                const listItem = document.createElement('li');
                listItem.textContent = genre;
                genresList.appendChild(listItem);
            });
            document.querySelector('.list-container ul').appendChild(genresList);

            // Populate voice actors and characters
            const castContainer = document.getElementById('cast');
            info.charactersVoiceActors.forEach(item => {
                const castItem = document.createElement('div');
                castItem.className = 'cast-item';
                castItem.innerHTML = `
                    <img src="${item.character.poster}" alt="${item.character.name}" class="cast-img">
                    <div class="cast-info">
                        <strong>${item.character.name}</strong> as ${item.character.cast}<br>
                        Voiced by: <strong>${item.voiceActor.name}</strong> (${item.voiceActor.cast})
                    </div>
                `;
                castContainer.appendChild(castItem);
            });

            // Populate promotional videos
            const videosContainer = document.getElementById('videos');
            info.promotionalVideos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.className = 'video-item';
                videoItem.innerHTML = `
                    <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                    <button class="video-button" data-url="${video.source}">Watch Video</button>
                `;
                videosContainer.appendChild(videoItem);
            });

            // Handle video button click
            videosContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('video-button')) {
                    const videoUrl = event.target.getAttribute('data-url');
                    showVideo(videoUrl);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
        });
});

// Function to show video modal
function showVideo(url) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.innerHTML = `
        <div class="video-overlay"></div>
        <iframe src="${url}" allowfullscreen></iframe>
        <button class="close-video">Close</button>
    `;
    document.body.appendChild(videoContainer);

    // Close video modal
    videoContainer.querySelector('.close-video').addEventListener('click', () => {
        document.body.removeChild(videoContainer);
    });

    // Close video modal when overlay is clicked
    videoContainer.querySelector('.video-overlay').addEventListener('click', () => {
        document.body.removeChild(videoContainer);
    });
}
