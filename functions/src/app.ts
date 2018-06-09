import { dialogflow } from 'actions-on-google';
import { module as sharedModule } from './prompts/shared/module';
import { module as videoModule } from './prompts/videos/module';
import { module as blogsModule } from './prompts/blogs/module';
import { module as eventsModule } from './prompts/events/module';
import { module as speakersModule } from './prompts/speakers/module';

const app = dialogflow();

app.intent([
  'Options Handler Fallback',
], sharedModule);

app.intent([
  'Video Search',
  'Recommend Videos',
  'Watch Show Episodes',
], videoModule);

app.intent([
  'Events - Next Event',
  'Events - Previous Event',
], eventsModule);

app.intent([
  'Speaker Information',
  'Speakers - Speaker info - known for',
  'Speaker Selection',
], speakersModule);

app.intent([
  'Read Blogpost',
], blogsModule);

export { app };
