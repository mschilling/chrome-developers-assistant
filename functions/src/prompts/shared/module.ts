import { handleOption } from "./intents/generic-options-handler";

const intents = {
  'Options Handler Fallback': handleOption,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
