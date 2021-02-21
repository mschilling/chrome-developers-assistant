import { dialogflow } from 'actions-on-google';
import { module as shared } from './prompts/shared/module';
import { module as video } from './prompts/videos/module';
import { module as blog } from './prompts/blogs/module';
import { module as event } from './prompts/events/module';
import { module as speaker } from './prompts/speakers/module';
import { Capabilities } from './utils/capabilities';

const app = dialogflow();

app.middleware((conv: any) => {
  console.log(`Intent ${conv.intent} matched with params ${JSON.stringify(conv.parameters)}`)

  conv.capabilities = new Capabilities(conv);
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
  'speaker_followup_videos_intent',
  'speaker_followup_known_for_intent',
  'speaker_followup_about_intent',
  'browse_speakers_intent',
], speaker);

app.intent([
  'browse_blogs_intent',
  'speaker_followup_blogs_intent'
], blog);

export { app };
