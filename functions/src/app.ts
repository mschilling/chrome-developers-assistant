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
  'Options Handler Fallback',
], shared);

app.intent([
  'Video Search',
  'Recommend Videos',
  'Watch Show Episodes',
], video);

app.intent([
  'browse-events',
  'next-event-date',
], event);

app.intent([
  'speaker_intent',
  'speaker_videos_intent',
  'Speakers - Speaker info',
  'Speakers - Speaker info - known for',
  'browse-speakers',
], speaker);

app.intent([
  'browse-blogs',
], blog);

export { app };
