const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

import { Firestore } from './shared/firestore';
Firestore.initialize(admin.firestore());

import { app } from './app';

// // Configure logging for hosting platforms that only support console.log and console.error
// debug.log = console.log.bind(console);
// error.log = console.error.bind(console);

process.env.DEBUG = 'actions-on-google:*';

exports.assistant = functions.https.onRequest(app);
