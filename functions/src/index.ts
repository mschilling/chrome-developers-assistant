import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

process.env.DEBUG = 'actions-on-google:*';

import { Firestore } from './shared/firestore';
Firestore.initialize(admin.firestore());

import { app } from './app';

exports.assistant = functions.https.onRequest(app);
