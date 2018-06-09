import { dialogflow } from 'actions-on-google';

import { module as videoModule } from './prompts/videos/module';
import { module as blogsModule } from './prompts/blogs/module';

import { nextEvent, previousEvent } from './intents/events-handler';
import { findEpisode } from './intents/youtube-shows-handler';
import { handleOption } from './intents/generic-options-handler';
import { speakerInfoHandler, knownForHandler, speakerSelection } from './intents/speakers-handler';

const Actions = require('./assistant-intents');

const app = dialogflow();

app.intent(Actions.INTENT_OPTION_SELECT, handleOption);
app.intent(Actions.INTENT_NEXT_EVENT, nextEvent);
app.intent(Actions.INTENT_PREV_EVENT, previousEvent);
app.intent(Actions.INTENT_FIND_SHOW_EPISODE, findEpisode);
app.intent(Actions.INTENT_SPEAKER_INFO, speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_INFO_KNOW_FOR, knownForHandler);
app.intent(Actions.INTENT_SPEAKER_INFO, speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_SELECTION, speakerSelection);

// Videos and related
app.intent([
  'Video Search',
  'Recommend Videos',
], videoModule);

// Blogs
app.intent([
  'Read Blogpost',
], blogsModule);

export { app };
