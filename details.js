        document.addEventListener('DOMContentLoaded', function () {
            // Get the value of the 'id' parameter from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const animeIdFromUrl = urlParams.get('id');

            // Check if the 'id' parameter is present in the URL
            if (!animeIdFromUrl) {
                console.error('Anime ID not provided in the URL');
                return; // This return statement is valid because it's inside this function
            }

            const apiUrl = `https://aniwatch-api-net.vercel.app/api/v2/hianime/anime/${animeIdFromUrl}`;

            // Fetch anime details from the API
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

                    // Update the <h1> tag with the anime name
                    const animeHeader = document.getElementById('anime-header');
                    if (animeHeader) {
                        animeHeader.textContent = anime.name;
                    }

                    // Set the document title to the anime name
                    document.title = anime.name;

                    // Populate main anime details
                    const animeImage = document.getElementById('anime-image');
                    if (animeImage) {
                        animeImage.src = anime.poster;
                    }
                    
                    const animeTitle = document.getElementById('anime-title');
                    if (animeTitle) {
                        animeTitle.textContent = anime.name;
                    }
                    
                    const animeDescription = document.getElementById('anime-description');
                    if (animeDescription) {
                        animeDescription.textContent = anime.description;                    }

                    // Set the watch link using anime.id from the response
                    const watchLink = document.getElementById('watch-link');
                    if (watchLink) {
                        watchLink.href = `episodes.html?id=${anime.id}`;
                    }

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
                            infoLeft?.appendChild(listItem);
                        } else {
                            infoRight?.appendChild(listItem);
                        }
                    });

                    // Populate promotional videos
                    const videoButton = documentElementById('video-button');
                    const videoModal = document.getElementById('video-modal');
                    const videoFrame = document.getElementById('video-frame');
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
                    const characterCardsContainer = document.getElementById('character-cards');
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

                    // Bookmark functionality
                    const bookmarkButton = document.getElementById('bookmark-button');
                    const welcomeDialog = document.getElementById('welcome-dialog');
                    const okButton = document.getElementById('ok-button');
                    const bookmarkMessage = document.getElementById('bookmark-message');

                    bookmarkButton.addEventListener('click', () => {
                        // Create a bookmark object
                        const bookmark = {
                            id: anime.id,
                            name: anime.name,
                            poster: anime.poster,
                            description: anime.description
                        };

                        // Save to localStorage
                        let bookmarks = JSON.parse(localStorage.getItem('animeBookmarks')) || [];
                        bookmarks.push(bookmark);
                        localStorage.setItem('animeBookmarks', JSON.stringify(bookmarks));

                        // Show bookmark confirmation dialog
                        bookmarkMessage.textContent = `${anime.name} is now in your bookmarks.`;
                        welcomeDialog.style.display = 'flex';
                    });

                    okButton.addEventListener('click', () => {
                        welcomeDialog.style.display = 'none';
                    });
                })
                .catch(error => console.error('Error fetching anime details:', error));
        });
