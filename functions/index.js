'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const TwitterHandleIntent = require('./get-twitter-handle');
const NextEventIntentHandler = require('./intent-next-event');
const PreviousEventIntentHandler = require('./intent-prev-event');
const KeynoteVideoIntentHandler = require('./intent-keynote-video');

const SpeakerInfoIntentHandler = require('./intent-speaker-info');
const VideosIntentHandler = require('./intent-videos');

// API.AI Intent names
const TWITTER_HANDLE_INTENT = 'twitter-handle';
const NEXT_EVENT_INTENT = 'next-event';
const PREV_EVENT_INTENT = 'prev-event';
const SPEAKER_INFO_INTENT = 'speaker-info';
const SPEAKER_INFO_KNOW_FOR_INTENT = 'speaker-info.known-for';
const SPEAKER_INFO_GITHUB_HANDLE_INTENT = 'speaker-info.github-handle';
const KEYNOTE_VIDEO_INTENT = 'keynote-video';
const EVENT_HIGHLIGHTS_INTENT = 'youtube-video.event-highlights';
const VIDEO_BY_SPEAKER_INTENT = 'youtube-video.by-speaker';

// Contexts
const WELCOME_CONTEXT = 'welcome';
const TWITTER_HANDLE_CONTEXT = 'twitter-handle';

exports.assistant = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({request: request, response: response});

  const actionMap = new Map();
  actionMap.set(TWITTER_HANDLE_INTENT, TwitterHandleIntent.twitterHandle);
  actionMap.set(NEXT_EVENT_INTENT, NextEventIntentHandler.nextEvent);
  actionMap.set(PREV_EVENT_INTENT, PreviousEventIntentHandler.previousEvent);
  actionMap.set(SPEAKER_INFO_INTENT, SpeakerInfoIntentHandler.speakerInfo);
  actionMap.set(SPEAKER_INFO_KNOW_FOR_INTENT, SpeakerInfoIntentHandler.knownFor);
  actionMap.set(SPEAKER_INFO_GITHUB_HANDLE_INTENT, SpeakerInfoIntentHandler.githubHandle);
  actionMap.set(KEYNOTE_VIDEO_INTENT, KeynoteVideoIntentHandler.keynoteVideo);
  actionMap.set(EVENT_HIGHLIGHTS_INTENT, VideosIntentHandler.eventHighlights);
  actionMap.set(VIDEO_BY_SPEAKER_INTENT, VideosIntentHandler.speakerVideos);
  assistant.handleRequest(actionMap);
});
