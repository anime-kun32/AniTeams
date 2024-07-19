document.addEventListener('DOMContentLoaded', function() {
    // Get the value of the 'id' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = urlParams.get('id');

    // Check if the 'id' parameter is present in the URL
    if (!animeId) {
        console.error('Anime ID not provided in the URL');
        return;
    }

    const apiUrl = `https://aniwatch-api-net.vercel.app/anime/info?id=${animeId}`;

    // Fetch anime details from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const anime = data.anime.info;
            const moreInfo = data.anime.moreInfo;

            // Populate main anime details
            document.getElementById('anime-image').src = anime.poster;
            document.getElementById('anime-title').textContent = anime.name;
            document.getElementById('anime-description').textContent = anime.description;
            document.getElementById('watch-link').href = '#';

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
                videoFrame.src = anime.promotionalVideos[0].source; // Load the first video by default
                videoModal.style.display = 'flex';
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
