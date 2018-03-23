'use strict';

import * as admin from 'firebase-admin';

// const Debug = require('debug');
// const debug = Debug('google-developer-assistant-api:debug');
// const error = Debug('google-developer-assistant-api:error');

const peopleRef = admin.firestore().collection('people');

function getPeople(limit = 10) {
  return peopleRef
    .orderBy('rank', 'desc')
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

function getPerson(id) {
  return peopleRef
    .doc(id)
    .get()
    .then(snapshot => {
      return snapshot.data();
    });
}

module.exports = {
  getPeople: getPeople,
  getPerson: getPerson
};
