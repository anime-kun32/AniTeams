document.addEventListener('DOMContentLoaded', function () {
    // Get the value of the 'id' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const animeIdFromUrl = urlParams.get('id');

    // Check if the 'id' parameter is present in the URL
    if (!animeIdFromUrl) {
        console.error('Anime ID not provided in the URL');
        return;
    }

    const apiUrl = `https://aniwatch-api-net.vercel.app/api/v2/hianime/anime/${animeIdFromUrl}`;

    // Fetch anime details from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Failed to fetch anime details');
                return;
            }

            const anime = data.data.anime.info;
            const moreInfo = data.data.anime.moreInfo;

            // Update the <h1> tag with the anime name
            document.getElementById('anime-header').textContent = anime.name;

            // Set the document title to the anime name
            document.title = anime.name;

            // Populate main anime details
            document.getElementById('anime-image').src = anime.poster;
            document.getElementById('anime-title').textContent = anime.name;
            document.getElementById('anime-description').textContent = anime.description;

            // Set the watch link using anime.id from the response
            const watchLink = document.getElementById('watch-link');
            watchLink.href = `episodes.html?id=${anime.id}`;

            // Populate more info
            const infoLeft = document.getElementById('more-info-left');
            const infoRight = document.getElementById('more-info-right');
            const moreInfoEntries = [
                `Japanese: ${moreInfo.japanese}`,
                `Synonyms: ${moreInfo.synonyms}`,
                `Aired: ${moreInfo.aired}`,
                `Premiered: ${moreInfo.premiered}`,
                `Duration: ${moreInfo.duration}`,
                `Status: ${moreInfo.status}`,
                `MAL Score: ${moreInfo.malscore}`,
                `Genres: ${moreInfo.genres.join(', ')}`,
                `Studios: ${moreInfo.studios}`,
                `Producers: ${moreInfo.producers.join(', ')}`
            ];

            moreInfoEntries.forEach((info, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = info;
                if (index % 2 === 0) {
                    infoLeft.appendChild(listItem);
                } else {
                    infoRight.appendChild(listItem);
                }
            });

            // Populate promotional videos
            const videoButton = document.getElementById('video-button');
            const videoModal = document.getElementById('video-modal');
            const videoFrame = document.getElementById('video-frame');
            const videoClose = document.getElementById('video-close');

            videoButton.addEventListener('click', () => {
                if (anime.promotionalVideos.length > 0) {
                    videoFrame.src = anime.promotionalVideos[0].source; // Load the first video by default
                    videoModal.style.display = 'flex';
                }
            });

            videoClose.addEventListener('click', () => {
                videoModal.style.display = 'none';
                videoFrame.src = '';
            });

            // Populate characters and voice actors
            const characterCardsContainer = document.getElementById('character-cards');
            anime.charactersVoiceActors.forEach(character => {
                const characterCard = document.createElement('div');
                characterCard.classList.add('character-card');
                characterCard.innerHTML = `
                    <img src="${character.character.poster}" alt="${character.character.name}">
                    <p>${character.character.name}</p>
                    <p>Voice Actor: ${character.voiceActor.name}</p>
                `;
                characterCardsContainer.appendChild(characterCard);
            });
        })
        .catch(error => console.error('Error fetching anime details:', error));
});

