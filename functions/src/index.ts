// Migration guide
//https://developers.google.com/actions/reference/nodejs/lib-v1-migration

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import { Firestore } from './shared/firestore';
Firestore.initialize(admin.firestore());

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

// // Configure logging for hosting platforms that only support console.log and console.error
// debug.log = console.log.bind(console);
// error.log = console.error.bind(console);

import { dialogflow } from 'actions-on-google';
import { searchBlogPosts } from './intents/blogposts-handler';
import { nextEvent, previousEvent } from './intents/events-handler';
import { findEpisode } from './intents/youtube-shows-handler';
import { handleOption } from './intents/generic-options-handler';
import { searchVideos, videoRecommendationHandler } from './intents/videos-handler';
import { speakerInfoHandler, knownForHandler, speakerSelection } from './intents/speakers-handler';

const Actions = require('./assistant-intents');

process.env.DEBUG = 'actions-on-google:*';

const app = dialogflow();

app.intent(Actions.INTENT_OPTION_SELECT, handleOption);
app.intent(Actions.INTENT_NEXT_EVENT, nextEvent);
app.intent(Actions.INTENT_PREV_EVENT, previousEvent);
app.intent(Actions.INTENT_VIDEO_SEARCH, searchVideos);
app.intent(Actions.INTENT_VIDEO_RECOMMEND, videoRecommendationHandler);
app.intent(Actions.INTENT_FIND_SHOW_EPISODE, findEpisode);
app.intent(Actions.INTENT_SPEAKER_INFO, speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_INFO_KNOW_FOR, knownForHandler);
app.intent(Actions.INTENT_SPEAKER_INFO, speakerInfoHandler);
app.intent(Actions.INTENT_SPEAKER_SELECTION, speakerSelection);
app.intent(Actions.INTENT_BLOGPOST_SEARCH, searchBlogPosts);

exports.assistant = functions.https.onRequest(app);
