'use strict';

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

// Context Parameters
const PERSON_PARAM = 'person';

function handleAction(assistant) {
  const key = assistant.getArgument(PERSON_PARAM);
  getPerson(key)
    .then(person => {
      if (person && person.github) {
        const speech = `<speak>His Github handle is${person.github}</speak>`;
        assistant.ask(speech);
      } else {
        const speech = 'Sorry, I couldn\'t find any';
        assistant.ask(speech);
      }
    });
}

function getPerson(key) {
  if (!key) Promise.resolve();

  return peopleRef.doc(key).get().then(function(doc) {
    return doc.data();
  });
}

module.exports = {
  githubHandle: handleAction
};
