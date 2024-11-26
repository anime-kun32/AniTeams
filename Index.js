let slideIndex = 0;
const sliderContainer = document.getElementById("slider-container");

// Fetch data from the API
async function fetchAnimes() {
    try {
        const response = await fetch('https://aniwatch-api-net.vercel.app/api/v2/hianime/home'); 
        const data = await response.json();
        if (data.success) {
            const spotlightAnimes = data.data.spotlightAnimes;
            spotlightAnimes.forEach(anime => {
                const slide = document.createElement("div");
                slide.classList.add("slide");

                // Create overlay
                const overlay = document.createElement("div");
                overlay.classList.add("img-overlay");

                // Create image
                const img = document.createElement("img");
                img.src = anime.poster; // Assuming the poster is in the response
                img.classList.add("slider-image");
                img.alt = anime.name;

                // Create content
                const content = document.createElement("div");
                content.classList.add("content");
                
                const title = document.createElement("h1");
                title.classList.add("title");
                title.textContent = anime.name;

                const description = document.createElement("p");
                description.classList.add("description");
                description.textContent = anime.description.split(" ").slice(0, 10).join(" ") + '...'; // Truncate to 10 words

                const buttons = document.createElement("div");
                buttons.classList.add("buttons");

                const watchButton = document.createElement("a");
                watchButton.href = `details.html?id=${anime.id}` ;
                watchButton.classList.add("watch-button");
                watchButton.textContent = "Watch Now";

                const detailsButton = document.createElement("a");
detailsButton.href = `details.html?id=${anime.id}`; 
detailsButton.classList.add("details-button");
detailsButton.textContent = "Details";


                // Append all elements
                buttons.appendChild(watchButton);
                buttons.appendChild(detailsButton);
                content.appendChild(title);
                content.appendChild(description);
                content.appendChild(buttons);
                slide.appendChild(overlay);
                slide.appendChild(img);
                slide.appendChild(content);
                sliderContainer.appendChild(slide);
            });
            showSlides(); // Call function to start showing slides
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function showSlides() {
    const slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = 0; // Reset opacity
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.opacity = 1; // Show current slide
    setTimeout(showSlides, 5000); // Change slide every 5 seconds
}

document.addEventListener("DOMContentLoaded", fetchAnimes);
