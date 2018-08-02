import { dialogflow } from 'actions-on-google';
import { module as shared } from './prompts/shared/module';
import { module as video } from './prompts/videos/module';
import { module as blog } from './prompts/blogs/module';
import { module as event } from './prompts/events/module';
import { module as speaker } from './prompts/speakers/module';

const app = dialogflow();

app.middleware(conv => {
  console.log(`Intent ${conv.intent} matched with params ${JSON.stringify(conv.parameters)}`)
})

app.intent([
  'options_fallback',
], shared);

app.intent([
  'video_search_intent',
  'recommended_videos',
  'watch_show_episode_intent',
], video);

app.intent([
  'browse_events_intent',
  'next_event_intent',
], event);

app.intent([
  'speaker_intent',
  'speaker_videos_intent',
  'Speakers - Speaker info',
  'Speakers - Speaker info - known for',
  'browse_speakers_intent',
], speaker);

app.intent([
  'browse_blogs_intent',
], blog);

export { app };
