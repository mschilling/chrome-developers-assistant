import { nextEvent, previousEvent } from "./intents/events-handler";
import { browseEvents } from "./intents/browse-events";

const intents = {
  'browse-events': browseEvents,
  'next-event-date': nextEvent,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
