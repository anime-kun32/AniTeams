document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeIdFromUrl = urlParams.get('id');

    if (!animeIdFromUrl) {
        console.error('Anime ID is not provided in the URL');
        return;
    }

    const apiUrl = `https://aniwatch-api-net.vercel.app/api/v2/hianime/anime/${animeIdFromUrl}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console('Failed to fetch anime details');
                return;
            }

            const anime = data.data.anime.info;
            const moreInfo = data.data.anime.moreInfo;

            // Set the document title
            document.title = anime.name;

            // Populate main anime details
            const animeImage = document.getElementById('anime-image');
            const animeTitle = document.getElementById('anime-title');
            const animeDescription = document.getElementById('anime-description');

            if (animeImage) animeImage.src = anime.poster;
            if (animeTitle) animeTitle.textContent = anime.name;
            if (animeDescription) animeDescription.textContent = anime.description;

            // Set the watch link
            const watchLink = document.getElementById('watch-link');
            if (watchLink) watchLink.href = `episodes.html?id=${anime.id}`;

            // Populate more info
            const infoLeft = document.getElementById('more-info-left');
            const infoRight = document.getElementById('more-info-right');
            if (infoLeft && infoRight) {
                const moreInfoEntries = [
                    `Japanese: ${moreInfo.japanese}`,
                    `Synonyms: ${moreInfo.synonyms}`,
                    `Aired: ${moreInfo.aired}`,
                    `Premiered: ${moreInfo.premiered}`,
                    `Duration: ${moreInfo.duration}`,
                    `Status: ${moreInfo.status}`,
                    `MAL Score: ${moreInfo.malscore}`,
                    `Genres ${moreInfo.genres.join(', ')}`,
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
            }

            // Populate promotional videos
            const videoButton = document.getElementById('video-button');
            const videoModal = document.getElementById('video-modal');
            const videoFrame = document.getElementById('video-frame'); // Fixed the query
            const videoClose = document.getElementById('video-close');

            if (videoButton && videoModal && videoFrame && videoClose) {
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
            }

            // Populate characters and voice actors
            const characterCardsContainer = document.getElementBy('character-cards');
            if (characterCardsContainer) {
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
            }
        })
        .catch(error => console.error('Error fetching anime details:', error));
});
