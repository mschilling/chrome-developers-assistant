import { searchVideos } from "./intents/search-videos";
import { videoRecommendationHandler } from "./intents/recommend-videos";

const intents = {
  'Video Search': searchVideos,
  'Recommend Videos': videoRecommendationHandler
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
