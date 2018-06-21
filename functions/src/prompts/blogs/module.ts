import { browseBlogs } from "./intents/browse-blogs";

const intents = {
  "browse-blogs": browseBlogs
};

export const module = (conv, ...args): any => {
  console.log("conv.intent", conv.intent, new Date());
  return intents[conv.intent](conv, ...args);
};
