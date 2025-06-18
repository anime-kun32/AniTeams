import nextPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.noitatnemucod.net',
      'artworks.thetvdb.com',
      's4.anilist.co',
      'media.kitsu.app',
      'i.animepahe.ru ',
    ],
  },
};

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
