'use strict';

const Debug = require('debug');
const debug = Debug('bite-api:debug');
const error = Debug('bite-api:error');

const admin = require('firebase-admin');
const videosRef = admin.firestore().collection('videos');

function searchKeynoteVideos(eventName, year, limit = 3) {
  return videosRef
    .where('isKeynote', '==', true)
    .limit(limit)
    .get()
    .then(snapshot => {
      const docs = [];
      for (let i = 0; i < snapshot.docs.length; i++) {
        docs.push(snapshot.docs[i].data());
      }
      return docs;
    });
}

function searchEventHighlightsVideo(eventKey) {
  if (!eventKey) {
    return undefined;
  };

  return videosRef
    .where('eventKey', '==', eventKey)
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length > 0) {
          return snapshot.docs[0].data();
      }
      return undefined;
    });
}


module.exports = {
  searchKeynoteVideos: searchKeynoteVideos,
  searchEventHighlightsVideo: searchEventHighlightsVideo
};
