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

  if (searchParams.person) {
    query = query.where(`authors.${searchParams.person}`, '==', true);
  }

  if (!searchParams.person) {
    query = query.orderBy('publishDate', 'desc');
  }

  return query
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
