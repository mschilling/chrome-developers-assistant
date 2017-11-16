'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const NextEventIntentHandler = require('./intent-next-event');
const PreviousEventIntentHandler = require('./intent-prev-event');

const SpeakerInfoIntentHandler = require('./intent-speaker-info');
const SpeakerSelectionIntentHandler = require('./intent-speaker-selection');
const VideosIntentHandler = require('./intent-videos');
const SpeakersIntentHandler = require('./intent-speakers');

// API.AI Intent names
const VIDEO_SEARCH_INTENT = 'video-search';
const TWITTER_HANDLE_INTENT = 'speaker-info';
const NEXT_EVENT_INTENT = 'next-event';
const PREV_EVENT_INTENT = 'prev-event';
const SPEAKER_INFO_INTENT = 'speaker-info';
const SPEAKER_INFO_KNOW_FOR_INTENT = 'speaker-info.known-for';
const SPEAKER_INFO_GITHUB_HANDLE_INTENT = 'speaker-info.github-handle';
const SPEAKER_SELECTION_INTENT = 'select-speaker';

// Contexts
const WELCOME_CONTEXT = 'welcome';

exports.assistant = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({request: request, response: response});

  const actionMap = new Map();
  // actionMap.set(TWITTER_HANDLE_INTENT, TwitterHandleIntent.twitterHandle);
  actionMap.set(NEXT_EVENT_INTENT, NextEventIntentHandler.nextEvent);
  actionMap.set(PREV_EVENT_INTENT, PreviousEventIntentHandler.previousEvent);
  actionMap.set(SPEAKER_INFO_INTENT, SpeakerInfoIntentHandler.speakerInfo);
  actionMap.set(SPEAKER_INFO_KNOW_FOR_INTENT, SpeakerInfoIntentHandler.knownFor);
  actionMap.set(SPEAKER_INFO_GITHUB_HANDLE_INTENT, SpeakerInfoIntentHandler.githubHandle);
  actionMap.set(VIDEO_SEARCH_INTENT, VideosIntentHandler.searchVideos);
  actionMap.set(SPEAKER_INFO_INTENT, SpeakersIntentHandler.speakerInfo);
  actionMap.set(SPEAKER_SELECTION_INTENT, SpeakerSelectionIntentHandler.speakerSelection);
  assistant.handleRequest(actionMap);
});
