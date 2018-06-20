import { browseBlogs } from "./intents/blogposts-handler";

const intents = {
  "browse-blogs": browseBlogs
};

export const module = (conv, ...args): any => {
  console.log("conv.intent", conv.intent, new Date());
  return intents[conv.intent](conv, ...args);
};
