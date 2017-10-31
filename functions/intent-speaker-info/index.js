'use strict';

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

const KnownForHandler = require('./known-for');
const GithubHandleHandler = require('./github-handle');

// Context Parameters
const PERSON_PARAM = 'person';

function handleAction(assistant) {
  const key = assistant.getArgument(PERSON_PARAM);
  getPerson(key)
    .then(person => {
      if (person) {
        const speech = `<speak>${person.first_name} ${person.last_name} is a developer from the Chrome Team</speak>`;
        assistant.ask(speech);
      } else {
        const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
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
    speakerInfo: handleAction,
    knownFor: KnownForHandler.knownFor,
    githubHandle: GithubHandleHandler.githubHandle
};
