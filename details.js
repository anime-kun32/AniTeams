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
 = data.data.anime.moreInfo;

                    document.getElementById('anime-header').textContent = anime.name;
                    document.title = anime.name;
                    document.getElementById('anime-image').src = anime.poster;
                    document.getElementById('anime-title').textContent = anime.name;
                    document.getElementById('anime-description').textContent = anime.description;
                    document.getElementById('watch-link').href = `episodes.html?id=${anime.id}`;

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
                        if ( 0) {
                            document.getElementById('more-info-left').appendChild(listItem);
                        } else {
                            document.getElementById('more-info-right').appendChild(listItem);
                        }
                    });

                    document.getElementById('video-button').addEventListener('click', () => {
                        const videoModal = document.getElementById('video-modal');
                        const videoFrame = document.getElementById('video-frame');
                        if (anime.promotionalVideos.length > 0) {
                            videoFrame.src = anime.promotionalVideos[0].source;
                            videoModal.style.display = 'flex';
                        }
                    });

                    document.getElementById('video-close').addEventListener('click', () => {
                        const videoModal = document.getElementById('video-modal');
                        videoModal.style.display = 'none';
                        document.getElementById('video-frame').src = ''; // Reset video
                    });

                    const characterCardsContainer = document.getElementById('character-cards');
                    anime.charactersVoiceActors.forEach(character => {
                        const characterCard = document.createElement('div');
                        characterCard.classList.add('character-card');
                        characterHTML = `
                            <img src="${character.character.poster}" alt="${character.character.name}">
                            <p>${character.character.name}</p>
                            <p>Voice Actor: ${character.voiceActor.name}</p>
                        `;
                        characterCardsContainer.appendChild(characterCard);
                    });

                    const bookmarkButton = document.getElementById('bookmark-button');
                    const welcomeDialog = document.getElementById('welcome-dialog');
                    const okButton = document.getElementById('ok-button');
                    const bookmarkMessage = document.getElementById('bookmark-message');

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

                        bookmarkMessage.textContent = `${anime.name} is now in your bookmarks.`;
                        welcomeDialog.style.display = 'flex';
                    });

                    okButton('click', () => {
                        welcomeDialog.style.display = 'none';
                    });
                })
                .catch(error => console.error('Error fetching anime details:', error));
        })
