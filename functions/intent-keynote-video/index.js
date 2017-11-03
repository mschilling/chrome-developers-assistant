'use strict';

const moment = require('moment');
const admin = require('firebase-admin');
const db = admin.firestore();

// Context Parameters
const EVENT_KEY_PARAM = 'event-key';

function keynoteVideoHandler(assistant) {

    const eventKey = assistant.getArgument(EVENT_KEY_PARAM);
    // if(searchDate) {
    //     inputDate = moment(searchDate, "YYYY-MM-DD").toDate();
    // }

    getKeynoteVideo(eventKey)
        .then( result => {
        if (result) {
            const url = `https://www.youtube.com/watch?v=${result.videoId}`;
            const speech = `<speak>
                Here is the keynote video on YouTube ${url}.<break time="1"/>
                </speak>`;
            assistant.ask(speech);
        } else {
            const speech = 'Sorry, I couldn\'t find anything right now';
            assistant.ask(speech);
        }
    })
}

function getKeynoteVideo(eventKeyParam) {
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
