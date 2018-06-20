import { dialogflow } from 'actions-on-google';
import { module as shared } from './prompts/shared/module';
import { module as video } from './prompts/videos/module';
import { module as blog } from './prompts/blogs/module';
import { module as event } from './prompts/events/module';
import { module as speaker } from './prompts/speakers/module';

const app = dialogflow();

app.intent([
  'Options Handler Fallback',
], shared);

app.intent([
  'Video Search',
  'Recommend Videos',
  'Watch Show Episodes',
], video);

app.intent([
  'Events - Next Event',
  'Events - Previous Event',
], event);

app.intent([
  'Speaker Information',
  'Speakers - Speaker info',
  'Speakers - Speaker info - known for',
  'Speaker Selection',
], speaker);

app.intent([
  'browse-blogs',
], blog);

export { app };
