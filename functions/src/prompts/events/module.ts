import { nextEvent, previousEvent } from "./intents/events-handler";

const intents = {
  'Events - Next Event': nextEvent,
  'Events - Previous Event': previousEvent,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
