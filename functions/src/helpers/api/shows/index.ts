'use strict';

import * as admin from 'firebase-admin';

// const Debug = require('debug');
// const debug = Debug('google-developer-assistant-api:debug');
// const error = Debug('google-developer-assistant-api:error');

const showsRef = admin.firestore().collection('shows');

function getItems(inputFilters) {
  const filters = inputFilters || {};

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
