import { speakerInfoHandler, knownForHandler } from "./intents/speakers-handler";
import { browseSpeaker } from "./intents/browse-speakers";

const intents = {
  'Speaker Information': speakerInfoHandler,
  'Speakers - Speaker info - known for': knownForHandler,
  'Speakers - Speaker info': speakerInfoHandler,
  'browse-speakers': browseSpeaker,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
