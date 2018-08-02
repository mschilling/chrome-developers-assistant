import { searchVideos } from "./intents/search-videos";
import { videoRecommendationHandler } from "./intents/recommend-videos";
import { findEpisode } from "./intents/youtube-shows-handler";

const intents = {
  'video_search_intent': searchVideos,
  'recommended_videos': videoRecommendationHandler,
  'watch_show_episode_intent': findEpisode
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
