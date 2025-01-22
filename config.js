// config.js
const api = "https://aniwatch-api-net.vercel.app/api/v2/hianime/home";  // Your deployed API URL
const search = "https://aniwatch-api-net.vercel.app/api/v2/hianime/search"; // Search API URL
const details = "https://aniwatch-api-net.vercel.app/api/v2/hianime/anime";  // Your additional variable

export default api;  // Change to default export
export { search, details };  // Export search and anotherVariable as named exports
