import { handleOption } from "./intents/generic-options-handler";

const intents = {
  'options_fallback': handleOption,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
