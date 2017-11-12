'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

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
    debug('eventKey is undefined');
    return undefined;
  };

  return videosRef
    .where('eventKey', '==', eventKey)
    .where('tags.highlights', '==', true)
    .limit(1)
    .get()
    .then(snapshot => {
      debug('videosRef snapshot result', snapshot.docs);
      if (snapshot.docs.length > 0) {
        return snapshot.docs[0].data();
      }
      debug('no results found');
      return undefined;
    });
}

function filterVideosBySpeakers(speakers, limit = 3) {
  if ((speakers || []).length === 0) {
    debug('speakers is undefined');
    return undefined;
  };

  debug(speakers);

  const speakersList = speakers.map( p => p.trim() );

  let promise = videosRef;

  for (let i=0; i< speakersList.length; i++) {
    promise = promise.where(`speakers.${speakersList[i]}`, '==', true);
  }

  return promise
    // .orderBy('dateAdded', 'asc')
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

module.exports = {
  searchKeynoteVideos: searchKeynoteVideos,
  searchEventHighlightsVideo: searchEventHighlightsVideo,
  filterVideosBySpeakers: filterVideosBySpeakers
};
