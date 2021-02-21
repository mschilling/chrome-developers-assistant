import { knownForHandler } from "./intents/speakers-handler";
import { browseSpeaker } from "./intents/browse-speakers";
import { speakerVideosIntent, speakerIntent } from './intents/speaker-intent';

const intents = {
  'speaker_intent': speakerIntent,
  'speaker_followup_videos_intent': speakerVideosIntent,
  'speaker_followup_known_for_intent': knownForHandler,
  'speaker_followup_about_intent': knownForHandler,
  'browse_speakers_intent': browseSpeaker,
};

export const module = (conv, ...args): any => {
  return intents[conv.intent](conv, ...args);
};
