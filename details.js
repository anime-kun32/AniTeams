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
                console.error('Failed to fetch anime details');
                return;
            }

            const anime = data.data.anime.info;
            const moreInfo = data.data.anime.moreInfo;

            document.title = anime.name;
            const animeImage = document.getElementById('anime-image');
            const animeTitle = document.getElementById('anime-title');
            const animeDescription = document.getElementById('anime-description');

            if (animeImage) animeImage.src = anime.poster;
            if (animeTitle) animeTitle.textContent = anime.name;
            if (animeDescription) animeDescription.textContent = anime.description;

            // Set the watch link
            const watchLink = document.getElementById('watch-link');
            if (watchLink) watchLink.href = `episodes.html?id=${anime.id}`;

            // Add the bookmark button
            const bookmarkContainer = document.getElementById('bookmark-container');
            if (bookmarkContainer) {
                let isBookmarked = false;
                const bookmarkButton = document.createElement('button');
                const bookmarkMessage = document.createElement('div');

                bookmarkButton.textContent = 'Bookmark';
                bookmarkButton.id = 'bookmark-button';
                bookmarkMessage.id = 'bookmark-message';
                bookmarkMessage.style.color = 'green';
                bookmarkMessage.style.marginTop = '10px';

                bookmarkContainer.appendChild(bookmarkButton);
                bookmarkContainer.appendChild(bookmarkMessage);

                // Dialog elements
                const welcomeDialog = document.getElementById('welcome-dialog');
                const dialogHeader = document.querySelector('.dialog-header');
                const dialogMessage = document.querySelector('.dialog-message');
                const okButton = document.getElementById('ok-button');

                // Event listener for bookmark button
                bookmarkButton.addEventListener('click', () => {
                    isBookmarked = !isBookmarked;
                    if (isBookmarked) {
                        bookmarkMessage.textContent = `${anime.name} is now bookmarked!`;
                        bookmarkButton.textContent = 'Bookmarked';

                        // Show dialog with anime title
                        if welcomeDialog && dialogHeader && dialogMessage) {
                            dialogHeader.textContent = `🎉 ${anime.name} is Bookmarked!`;
                            dialogMessage.innerHTML = `<ul><li>✨ ${anime.name} is now saved in your bookmarks.</li></ul>`;
                            welcomeDialog.style.display = 'flex';
                        }
                    } else {
                        bookmarkMessage.textContent = `${anime.name} is no longer bookmarked.`;
                        bookmarkButton.textContent = 'Bookmark';
                    }
                });

                // Close dialog on "OK" button click
                if (okButton) {
                    okButton.addEventListener('click', () => {
                        if (welcomeDialog) {
                            welcomeDialog.style.display = 'none';
                        }
                    });
                }
            }

            // Populate more info
            const infoLeft = document.getElementById('more-info-left');
            const infoRight = document.getElementById('more-info-right');
            if (infoLeft && infoRight) {
                const moreInfoEntries = [
                    `Japanese: ${moreInfo.j}`,
                    `Synonyms: ${moreInfo.synonyms}`,
                    `Aired: ${moreInfo.aired}`,
                    `Premiered: ${moreInfo.premiered}`,
                    `Duration: ${moreInfo.duration}`,
                    `Status: ${moreInfo.status}`,
                    `MAL Score: ${moreInfo.malscore}`,
                    `Genres: ${moreInfo.genres.join(', ')}`,
                    `Studios: ${more.studios}`,
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
            const videoFrame = document.getElementById('video-frame');
            const videoClose = document.getElementById('video-close');

            if (videoButton && videoModal && videoFrame && videoClose) {
                videoButton.addEventListener('click', () => {
                    if (anime.promotionalVideos && anime.promotionalVideos.length > 0) {
                        videoFrame.src = anime.promotionalVideos[0].source;
                        videoModal.style.display = 'flex'; // Corrected here
                    }
                });

                videoClose.addEventListener('click', () => {
                    videoModal.style.display = 'none';
                    videoFrame.src = '';
                });
            }

            // Populate characters and voice actors
            const characterCardsContainer = document.getElementById('character-cards');
            if (characterCardsContainer) {
                anime.charactersVActors.forEach(character => {
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
        .catch(error => console.error('Error fetching anime details or processing data:', error));
});
