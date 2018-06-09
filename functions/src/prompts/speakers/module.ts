import { speakerInfoHandler, knownForHandler, speakerSelection } from "./intents/speakers-handler";

const intents = {
  'Speaker Information': speakerInfoHandler,
  'Speakers - Speaker info - known for': knownForHandler,
  // 'Video Search': speakerInfoHandler,
  'Speaker Selection': speakerSelection,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
