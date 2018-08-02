import { nextEvent, previousEvent } from "./intents/events-handler";
import { browseEvents } from "./intents/browse-events";

const intents = {
  'browse_events_intent': browseEvents,
  'next_event_intent': nextEvent,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
