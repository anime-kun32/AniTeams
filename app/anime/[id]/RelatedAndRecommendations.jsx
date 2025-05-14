import { useEffect, useState } from 'react';
import AnimeCard from './AnimeCard';
import AnimeCardSkeleton from './AnimeCardSkeleton';

const RelatedAndRecommendations = ({
  animeId,
  showRelated = true,
  showRecommendations = true,
}) => {
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = `
    query ($id: Int) {
      Media(id: $id) {
        relations {
          edges {
            node {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              status
              startDate {
                year
              }
              episodes
              averageScore
            }
          }
        }
        recommendations(sort: RATING_DESC, perPage: 10) {
          nodes {
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              status
              startDate {
                year
              }
              episodes
              averageScore
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    setLoading(true);
    fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { id: animeId },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (showRelated) {
          const relations = res.data.Media.relations.edges.map((edge) => ({
            id: edge.node.id,
            image: edge.node.coverImage.large,
            title: {
              english: edge.node.title.english,
              romaji: edge.node.title.romaji,
            },
            status: edge.node.status,
            releaseDate: edge.node.startDate.year,
            totalEpisodes: edge.node.episodes,
            rating: edge.node.averageScore ? edge.node.averageScore / 10 : null,
          }));
          setRelatedAnime(relations);
        }

        if (showRecommendations) {
          const recs = res.data.Media.recommendations.nodes.map((node) => ({
            id: node.mediaRecommendation.id,
            image: node.mediaRecommendation.coverImage.large,
            title: {
              english: node.mediaRecommendation.title.english,
              romaji: node.mediaRecommendation.title.romaji,
            },
            status: node.mediaRecommendation.status,
            releaseDate: node.mediaRecommendation.startDate.year,
            totalEpisodes: node.mediaRecommendation.episodes,
            rating: node.mediaRecommendation.averageScore ? node.mediaRecommendation.averageScore / 10 : null,
          }));
          setRecommendations(recs);
        }
      })
      .finally(() => setLoading(false));
  }, [animeId, showRelated, showRecommendations]);

  const renderSection = (title, data) => (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="pb-10 mt-5 grid grid-cols-3 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[1fr] 2xl:grid-cols-7 3xl:grid-cols-8">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => <AnimeCardSkeleton key={index} />)
          : data.map((anime) => <AnimeCard key={anime.id} data={anime} />)}
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-10">
      {showRelated && relatedAnime.length > 0 && renderSection('Related Anime', relatedAnime)}
      {showRecommendations && recommendations.length > 0 && renderSection('Recommendations', recommendations)}
    </div>
  );
};

export default RelatedAndRecommendations;
