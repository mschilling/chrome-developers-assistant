'use strict';

const moment = require('moment');
const admin = require('firebase-admin');
const db = admin.firestore();

const responses = require('../../helpers/responses');

// Context Parameters
const PERSON_PARAM = 'person';
const DATE_PERIOD_PARAM = 'date-period';
const EVENT_PARAM = 'event';

function videoBySpeakerHandler(assistant) {

    const speaker = assistant.getArgument(PERSON_PARAM);
    const datePeriod = assistant.getArgument(DATE_PERIOD_PARAM);
    const event = assistant.getArgument(EVENT_PARAM);

    console.log(speaker, datePeriod, event);

    searchVideos(speaker, event, datePeriod, 3)
        .then( result => {
        if (result) {
            const params = {
              videoId: result.videoId,
              videoTitle: result.name
            };
            responses.responseYouTubeVideos(assistant, true, params);
        } else {
            responses.responseYouTubeVideos(assistant, false);
        }
    });
}

function searchVideos(speaker, event, year, limit = 5) {
  console.log(`Search video's (speaker=${speaker}, event=${event}, year=${year}`);
  return db.collection('videos')
     .where('speakers', '==', speaker)
    //  .where('isKeynote', '==', true)
     // .where('startDate', '>', dateString)
     // .orderBy('startDate', 'asc')
     .limit(limit)
     .get()
     .then(snapshot => {
         if(snapshot.docs.length > 0) {
             return snapshot.docs[0].data();
         }
         return {};
     });
}
module.exports = {
  videoBySpeaker: videoBySpeakerHandler
};
