import { searchBlogPosts } from "./intents/blogposts-handler";

const intents = {
  'Read Blogpost': searchBlogPosts,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
