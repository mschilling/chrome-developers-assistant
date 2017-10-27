'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const TwitterHandleIntent = require('./get-twitter-handle');
const NextEventIntentHandler = require('./intent-next-event');

// API.AI Intent names
const TWITTER_HANDLE_INTENT = 'twitter-handle';
const NEXT_EVENT_INTENT = 'next-event';

// // Contexts
const WELCOME_CONTEXT = 'welcome';
const TWITTER_HANDLE_CONTEXT = 'twitter-handle';

exports.assistant = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({request: request, response: response});

  const actionMap = new Map();
  actionMap.set(TWITTER_HANDLE_INTENT, TwitterHandleIntent.twitterHandle);
  actionMap.set(NEXT_EVENT_INTENT, NextEventIntentHandler.nextEvent);
  assistant.handleRequest(actionMap);
});
