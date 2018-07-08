import { nextEvent, previousEvent } from "./intents/events-handler";

const intents = {
  'next-event-date': nextEvent,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
