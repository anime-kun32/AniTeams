// Fetch the comicId from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const comicId = urlParams.get('id'); // Get the 'id' parameter from the URL

let currentPage = 1;
let totalPages = 0;
let pages = [];

const imageElement = document.getElementById('comic-image');
const loadingSpinner = document.getElementById('loading-spinner');
const progressBarChunk = document.querySelector('.progress-chunk');
const chapterList = document.getElementById('chapter-list');
const floatingMenu = document.getElementById('floating-menu');

document.getElementById('toggle-menu').addEventListener('click', (event) => {
  const isVisible = chapterList.style.display === 'flex';
  chapterList.style.display = isVisible ? 'none' : 'flex';
  event.stopPropagation(); // Prevent the click from propagating to the body
});

document.body.addEventListener('click', (event) => {
  if (!floatingMenu.contains(event.target)) {
    chapterList.style.display = 'none';
  }
});

const fullscreenButton = document.getElementById('fullscreen-btn');
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

function showLoading() {
  loadingSpinner.style.display = 'block';
  imageElement.classList.remove('loaded');
}

function hideLoading() {
  loadingSpinner.style.display = 'none';
  imageElement.classList.add('loaded');
}

async function fetchChapters() {
  try {
    const response = await fetch(`https://api-consumet-org-gamma.vercel.app/manga/mangadex/info/${comicId}`);
    const data = await response.json();

    if (data.chapters && Array.isArray(data.chapters)) {
      console.log('Chapters fetched successfully');
      populateChapters(data.chapters);
    } else {
      console.error('Error: API response does not contain a "chapters" array.');
    }
  } catch (error) {
    console.error('Error fetching chapters:', error);
  }
}

function populateChapters(chapters) {
  chapters.forEach((chapter, index) => {
    const chapterButton = document.createElement('button');
    chapterButton.textContent = `Chapter ${index + 1}`;
    chapterButton.addEventListener('click', () => fetchPagesForChapter(chapter.id));
    chapterList.appendChild(chapterButton);
  });
}

async function fetchPagesForChapter(chapterId) {
  try {
    const response = await fetch(`https://api-consumet-org-gamma.vercel.app/manga/mangadex/read/${chapterId}`);
    pages = await response.json();
    totalPages = pages.length;
    preloadImages(pages.map(page => page.img));
    displayPages(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
  }
}

function displayPages(pages) {
  currentPage = 1;
  updateReader();
}

function updateReader() {
  if (currentPage > 0 && currentPage <= totalPages) {
    showLoading();
    imageElement.onload = hideLoading;
    imageElement.src = pages[currentPage - 1].img;
    updateProgressBar();
  }
}

function updateProgressBar() {
  const progress = (currentPage / totalPages) * 100;
  progressBarChunk.style.width = `${progress}%`;
}

function preloadImages(pageUrls) {
  pageUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    updateReader();
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    updateReader();
  }
});

// Call fetchChapters to load chapters based on the comicId from the URL
if (comicId) {
  fetchChapters();
} else {
  console.error('Error: comicId is not provided in the URL parameters.');
}
