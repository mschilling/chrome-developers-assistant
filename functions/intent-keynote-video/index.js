'use strict';

const moment = require('moment');
const admin = require('firebase-admin');
const db = admin.firestore();

const responses = require('../helpers/responses');

// Context Parameters
const EVENT_KEY_PARAM = 'event-key';

function keynoteVideoHandler(assistant) {

    const eventKey = assistant.getArgument(EVENT_KEY_PARAM);

    getKeynoteVideo(eventKey)
        .then( result => {
        if (result) {
            const params = {
              videoId: result.videoId,
              videoTitle: result.name
            };
            responses.responseIntentKeynoteVideo(assistant, true, params);
        } else {
            responses.responseIntentKeynoteVideo(assistant, false);
        }
    });
}

function getKeynoteVideo(eventKeyParam) {
  console.log(`Find keynote video for event: ${eventKeyParam}`);
  return db.collection('videos')
     .where('eventKey', '==', eventKeyParam)
     .where('isKeynote', '==', true)
     // .where('startDate', '>', dateString)
     // .orderBy('startDate', 'asc')
     .limit(1)
     .get()
     .then(snapshot => {
         if(snapshot.docs.length > 0) {
             return snapshot.docs[0].data();
         }
         return {};
     });
}
module.exports = {
  keynoteVideo: keynoteVideoHandler
};
