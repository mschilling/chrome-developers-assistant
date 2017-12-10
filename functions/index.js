'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// EVENTS
const NextEventIntentHandler = require('./intent-next-event');
const PreviousEventIntentHandler = require('./intent-prev-event');

// SPEAKERS
const SpeakerInfoIntentHandler = require('./intent-speaker-info');
const SpeakerSelectionIntentHandler = require('./intent-speaker-selection');
const SpeakersIntentHandler = require('./intent-speakers');

// VIDEOS
const VideosIntentHandler = require('./intent-videos');

// VIDEOS
const BlogPostsIntentHandler = require('./intents/blogposts-handler');

// Shows
const ShowsIntentHandler = require('./intents/youtube-shows-handler');

// API.AI Intent names
const VIDEO_SEARCH_INTENT = 'video-search';
const VIDEO_SEARCH_FALLBACK_INTENT = 'option.select';
const NEXT_EVENT_INTENT = 'next-event';
const PREV_EVENT_INTENT = 'prev-event';
const SPEAKER_INFO_INTENT = 'speaker-info';
const SPEAKER_INFO_KNOW_FOR_INTENT = 'speaker-info.known-for';
const SPEAKER_SELECTION_INTENT = 'select-speaker';
const SPEAKER_SELECT_FALLBACK_INTENT = 'option.select-speaker';
const BLOGPOST_SEARCH_INTENT = 'blogpost-search';

exports.assistant = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({ request: request, response: response });

  const actionMap = new Map();
  actionMap.set(NEXT_EVENT_INTENT, NextEventIntentHandler.nextEvent);
  actionMap.set(PREV_EVENT_INTENT, PreviousEventIntentHandler.previousEvent);
  actionMap.set(SPEAKER_INFO_INTENT, SpeakerInfoIntentHandler.speakerInfo);
  actionMap.set(SPEAKER_INFO_KNOW_FOR_INTENT, SpeakerInfoIntentHandler.knownFor);
  actionMap.set(VIDEO_SEARCH_INTENT, VideosIntentHandler.searchVideos);
  actionMap.set(VIDEO_SEARCH_FALLBACK_INTENT, VideosIntentHandler.selectVideoByOption);
  actionMap.set(SPEAKER_INFO_INTENT, SpeakersIntentHandler.speakerInfo);
  actionMap.set(SPEAKER_SELECTION_INTENT, SpeakerSelectionIntentHandler.speakerSelection);
  actionMap.set(SPEAKER_SELECT_FALLBACK_INTENT, SpeakerInfoIntentHandler.selectSpeakerByOption);
  actionMap.set(BLOGPOST_SEARCH_INTENT, BlogPostsIntentHandler.searchBlogPosts);
  actionMap.set('find-show-episode', ShowsIntentHandler.findEpisode);
  actionMap.set('generic.options.handler', BlogPostsIntentHandler.genericOptionsHandler);
  assistant.handleRequest(actionMap);
});
