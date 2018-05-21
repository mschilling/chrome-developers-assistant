// Migration guide
//https://developers.google.com/actions/reference/nodejs/lib-v1-migration

import * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';
import { searchBlogPosts } from './intents/blogposts-handler';

const app = dialogflow();

process.env.DEBUG = 'actions-on-google:*';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const Actions = require('./assistant-intents');

// Conversation (intent) handlers
const EventsIntentHandler = require('./intents/events-handler');
const SpeakersIntentHandler = require('./intents/speakers-handler');
const VideosIntentHandler = require('./intents/videos-handler');
// const BlogPostsIntentHandler = require('./intents/blogposts-handler');
const GenericOptionsHandler = require('./intents/generic-options-handler');
const ShowsIntentHandler = require('./intents/youtube-shows-handler');

// console.log('headers: ' + JSON.stringify(request.headers));
// console.log('body: ' + JSON.stringify(request.body));
app.intent(Actions.INTENT_OPTION_SELECT, GenericOptionsHandler.handleOption);
app.intent(Actions.INTENT_NEXT_EVENT, EventsIntentHandler.nextEvent);
app.intent(Actions.INTENT_PREV_EVENT, EventsIntentHandler.previousEvent);
app.intent(Actions.INTENT_VIDEO_SEARCH, VideosIntentHandler.searchVideos);
app.intent(Actions.INTENT_VIDEO_RECOMMEND, VideosIntentHandler.videoRecommendationHandler);
app.intent(Actions.INTENT_FIND_SHOW_EPISODE, ShowsIntentHandler.findEpisode);
app.intent(Actions.INTENT_SPEAKER_INFO, SpeakersIntentHandler.speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_INFO_KNOW_FOR, SpeakersIntentHandler.knownForHandler);
app.intent(Actions.INTENT_SPEAKER_INFO, SpeakersIntentHandler.speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_SELECTION, SpeakersIntentHandler.speakerSelection);
app.intent(Actions.INTENT_BLOGPOST_SEARCH, searchBlogPosts);

exports.assistant = functions.https.onRequest(app);
