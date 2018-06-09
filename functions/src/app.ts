import { dialogflow } from 'actions-on-google';

import { searchBlogPosts } from './intents/blogposts-handler';
import { nextEvent, previousEvent } from './intents/events-handler';
import { findEpisode } from './intents/youtube-shows-handler';
import { handleOption } from './intents/generic-options-handler';
import { searchVideos, videoRecommendationHandler } from './intents/videos-handler';
import { speakerInfoHandler, knownForHandler, speakerSelection } from './intents/speakers-handler';

import { module as videoModule } from './videos/module';

const Actions = require('./assistant-intents');

const app = dialogflow();

app.intent(Actions.INTENT_OPTION_SELECT, handleOption);
app.intent(Actions.INTENT_NEXT_EVENT, nextEvent);
app.intent(Actions.INTENT_PREV_EVENT, previousEvent);
// app.intent(Actions.INTENT_VIDEO_SEARCH, searchVideos);
// app.intent(Actions.INTENT_VIDEO_RECOMMEND, videoRecommendationHandler);
app.intent(Actions.INTENT_FIND_SHOW_EPISODE, findEpisode);
app.intent(Actions.INTENT_SPEAKER_INFO, speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_INFO_KNOW_FOR, knownForHandler);
app.intent(Actions.INTENT_SPEAKER_INFO, speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_SELECTION, speakerSelection);
app.intent(Actions.INTENT_BLOGPOST_SEARCH, searchBlogPosts);

app.intent([
  'Video Search',
  'Recommend Videos',
], videoModule);

export { app };
