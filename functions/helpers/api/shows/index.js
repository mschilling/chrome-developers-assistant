'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

const admin = require('firebase-admin');
const showsRef = admin.firestore().collection('shows');

function getItems(filters) {
  filters = filters || {};

  const limit = filters.limit || 3;

  return showsRef
    // .where('isKeynote', '==', true)
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
  getItems: getItems
};
