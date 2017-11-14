'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

function getPerson(id) {
  return peopleRef
    .doc(id)
    .get()
    .then(snapshot => {
      return snapshot.data();
    });
}

module.exports = {
  getPerson: getPerson,
};
