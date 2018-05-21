// Migration guide
//https://developers.google.com/actions/reference/nodejs/lib-v1-migration

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

import { dialogflow } from 'actions-on-google';
import { searchBlogPosts } from './intents/blogposts-handler';
import { nextEvent, previousEvent } from './intents/events-handler';

const app = dialogflow();

process.env.DEBUG = 'actions-on-google:*';

const Actions = require('./assistant-intents');

// Conversation (intent) handlers
const EventsIntentHandler = require('./intents/events-handler');
const SpeakersIntentHandler = require('./intents/speakers-handler');
const VideosIntentHandler = require('./intents/videos-handler');
// const BlogPostsIntentHandler = require('./intents/blogposts-handler');
const GenericOptionsHandler = require('./intents/generic-options-handler');
const ShowsIntentHandler = require('./intents/youtube-shows-handler');

app.intent(Actions.INTENT_OPTION_SELECT, GenericOptionsHandler.handleOption);
app.intent(Actions.INTENT_NEXT_EVENT, nextEvent);
app.intent(Actions.INTENT_PREV_EVENT, previousEvent);
app.intent(Actions.INTENT_VIDEO_SEARCH, VideosIntentHandler.searchVideos);
app.intent(Actions.INTENT_VIDEO_RECOMMEND, VideosIntentHandler.videoRecommendationHandler);
app.intent(Actions.INTENT_FIND_SHOW_EPISODE, ShowsIntentHandler.findEpisode);
app.intent(Actions.INTENT_SPEAKER_INFO, SpeakersIntentHandler.speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_INFO_KNOW_FOR, SpeakersIntentHandler.knownForHandler);
app.intent(Actions.INTENT_SPEAKER_INFO, SpeakersIntentHandler.speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_SELECTION, SpeakersIntentHandler.speakerSelection);
app.intent(Actions.INTENT_BLOGPOST_SEARCH, searchBlogPosts);

exports.assistant = functions.https.onRequest(app);
