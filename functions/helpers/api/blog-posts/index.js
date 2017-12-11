'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

const admin = require('firebase-admin');
const blogPostsRef = admin.firestore().collection('blogposts');

function search(searchParams, limit = 10) {
  if (!searchParams) {
    debug('searchParams is undefined');
    return undefined;
  };

  let query = blogPostsRef;

  // if (searchParams.event) {
  //   query = query.where('eventKey', '==', searchParams.event);
  // }

  // if (searchParams.tags && searchParams.tags.length > 0) {
  //   for (let i = 0; i < searchParams.tags.length; i++) {
  //     const tag = searchParams.tags[i] || '';
  //     query = query.where(`tags.${tag}`, '==', true);
  //   }
  // }

  // if (searchParams.speakers && searchParams.speakers.length > 0) {
  //   const speakersList = searchParams.speakers.map(p => p.trim());
  //   for (let i = 0; i < speakersList.length; i++) {
  //     const speaker = speakersList[i] || '';
  //     query = query.where(`speakers.${speaker}`, '==', true);
  //   }
  // }


  return query
    .orderBy('publishDate', 'desc')
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

function getByKey(key) {
  if (!key) {
    debug('key is undefined');
    return;
  };

  return blogPostsRef
    .doc(key)
    .get()
    .then(snapshot => {
      return snapshot.data();
    });
}

module.exports = {
  search: search,
  getByKey: getByKey
};
