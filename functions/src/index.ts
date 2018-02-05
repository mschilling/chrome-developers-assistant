import * as functions from 'firebase-functions';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').DialogflowApp;
// const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const Actions = require('./assistant-actions');

// Conversation (intent) handlers
const EventsIntentHandler = require('./intents/events-handler');
const SpeakersIntentHandler = require('./intents/speakers-handler');
const VideosIntentHandler = require('./intents/videos-handler');
const BlogPostsIntentHandler = require('./intents/blogposts-handler');
const GenericOptionsHandler = require('./intents/generic-options-handler');
const ShowsIntentHandler = require('./intents/youtube-shows-handler');

exports.assistant = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({ request: request, response: response });

  const actionMap = new Map();
  actionMap.set(Actions.ACTION_OPTION_SELECT, GenericOptionsHandler.handleOption);

  actionMap.set(Actions.ACTION_NEXT_EVENT, EventsIntentHandler.nextEvent);
  actionMap.set(Actions.ACTION_PREV_EVENT, EventsIntentHandler.previousEvent);

  actionMap.set(Actions.ACTION_VIDEO_SEARCH, VideosIntentHandler.searchVideos);
  actionMap.set(Actions.ACTION_VIDEO_RECOMMEND, VideosIntentHandler.videoRecommendationHandler);

  actionMap.set(Actions.ACTION_FIND_SHOW_EPISODE, ShowsIntentHandler.findEpisode);

  actionMap.set(Actions.ACTION_SPEAKER_INFO, SpeakersIntentHandler.speakerInfoHandler);
  actionMap.set(Actions.ACTION_SPEAKER_INFO_KNOW_FOR, SpeakersIntentHandler.knownForHandler);
  actionMap.set(Actions.ACTION_SPEAKER_INFO, SpeakersIntentHandler.speakerInfoHandler);
  actionMap.set(Actions.ACTION_SPEAKER_SELECTION, SpeakersIntentHandler.speakerSelection);

  actionMap.set(Actions.ACTION_BLOGPOST_SEARCH, BlogPostsIntentHandler.searchBlogPosts);

  assistant.handleRequest(actionMap);
});
