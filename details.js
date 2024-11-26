document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const animeIdFromUrl = urlParams.get('id');

    if (!animeIdFromUrl) {
        console.error('Anime ID not provided in the URL');
        return;
    }

    const apiUrl = `https://aniwatch-api-net.vercel.app/api/v2/hianime/anime/${animeIdFromUrl}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                console.error('Failed to fetch anime details');
                return;
            }

            const anime = data.data.anime.info;
            const moreInfo = data.data.anime.moreInfo;

            const animeHeader = document.getElementById('anime-header');
            const animeImage = document.getElementById('anime-image');
            const animeTitle = document.getElementById('anime-title');
            const animeDescription = document.getElementById('anime-description');
            const watchLink = document.getElementById('watch-link');

            if (animeHeader) animeHeader.textContent = anime.name;
            document.title = anime.name;
            if (animeImage) animeImage.src = anime.poster;
            if (animeTitle) animeTitle.textContent = anime.name;
            if (animeDescription) animeDescription.textContent = anime.description;
            if (watchLink) watchLink.href = `episodes.html?id=${anime.id}`;

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

            const moreInfoLeft = document.getElementById('more-info-left');
            const moreInfoRight = document.getElementById('more-info-right');

          moreInfoEntries.forEach((info, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = info;
    if (index % 2 === 0 && moreInfoLeft) {
        moreInfoLeft.appendChild(listItem); 
    } else if (moreInfoRight) {
        moreInfoRight.appendChild(listItem);
    }
});


            const videoButton = document.getElementById('video-button');
            const videoModal = document.getElementById('video-modal');
            const videoFrame = document.getElementById('video-frame');
            if (videoButton) {
                videoButton.addEventListener('click', () => {
                    if (anime.promotionalVideos.length > 0 && videoFrame) {
                        videoFrame.src = anime.promotionalVideos[0].source;
                        if (videoModal) videoModal.style.display = 'flex';
                    }
                });
            }

            const videoClose = document.getElementById('video-close');
            if (videoClose) {
                videoClose.addEventListener('click', () => {
                    if (videoModal) {
                        videoModal.style.display = 'none'; // Corrected to use style.display
                        if (videoFrame) videoFrame.src = ''; // Reset video
                    }
                });
            }

            const characterCardsContainer = document.getElementById('character-cards');
            anime.charactersVoiceActors.forEach(character => {
                const characterCard = document.createElement('div');
                characterCard.classList.add('character-card');
                characterCard.innerHTML = `
                    <img src="${character.character.poster}" alt="${character.character.name}">
                    <p>${character.character.name}</p>
                    <p>Voice Actor:character.voiceActor.name}</p>
                `;
                if (characterCardsContainer) {
                    characterCardsContainer.appendChild(characterCard);
                }
            });

            const bookmarkButton = document.getElementById('bookmark-button');
            const welcomeDialog = document.getElementById('welcome-dialog');
            const okButton = document.getElementById('ok-button');
            const bookmarkMessage = document.getElementById('bookmark-message');

            if (bookmarkButton) {
                bookmarkButton.addEventListener('click', () => {
                    const bookmark = {
                        id: anime.id,
                        name: anime.name,
                        poster: anime.poster,
                        description: anime.description
                    };

                    let bookmarks = JSON.parse(localStorage.getItem('animeBookmarks')) || [];
                    bookmarks.push(bookmark);
                    localStorage.setItem('animeBookmarks', JSON.stringify(bookmarks));

                    if (bookmarkMessage) {
                        bookmarkMessage.textContent = `${anime.name} is now in your bookmarks.`;
                    }
                    if (welcomeDialog) {
                        welcomeDialog.style.display = 'flex';
                    }
                });
            }

            if (okButton) {
                okButton.addEventListener('click', () => {
                    if (welcomeDialog) {
                        welcomeDialog.style.display = 'none';
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching anime details:', error));
});
