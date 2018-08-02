import { knownForHandler } from "./intents/speakers-handler";
import { browseSpeaker } from "./intents/browse-speakers";
import { speakerVideosIntent, speakerIntent } from './intents/speaker-intent';

const intents = {
  'speaker_intent': speakerIntent,
  'speaker_videos_intent': speakerVideosIntent,
  'speaker_known_for_intent': knownForHandler,
  'Speakers - Speaker info': speakerIntent,
  'browse_speakers_intent': browseSpeaker,
};

export const module = (conv, ...args): any => {
  console.log('conv.intent', conv.intent, new Date() );
  return intents[conv.intent](conv, ...args);
};
