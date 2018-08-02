import { browseBlogs } from './intents/browse-blogs';

const intents = {
  'browse_blogs_intent': browseBlogs
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date());
  return intents[conv.intent](conv, ...args);
};
