'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const people = admin.firestore().collection('people');

// API.AI Intent names
const TWITTER_HANDLE_INTENT = 'twitter-handle';

// // Contexts
const WELCOME_CONTEXT = 'welcome';
const TWITTER_HANDLE_CONTEXT = 'twitter-handle';

// Context Parameters
const PERSON_PARAM = 'person';

exports.assistant = functions.https.onRequest((request, response) => {
  console.log('headers: ' + JSON.stringify(request.headers));
  console.log('body: ' + JSON.stringify(request.body));

  const assistant = new Assistant({request: request, response: response});

  const actionMap = new Map();
  actionMap.set(TWITTER_HANDLE_INTENT, twitterHandle);
  assistant.handleRequest(actionMap);

  function twitterHandle(assistant) {
    const person = assistant.getArgument(PERSON_PARAM);
    console.log(`Person: ${person}`);

    people.doc(person).get().then(function(doc) {
      if (doc.exists) {
        const data = doc.data();

        const speech = `<speak>
          ${data.first_name}'s twitter handle is @${data.twitter}<break time="2"/>
          Anything else?
          </speak>`;
        assistant.ask(speech);
      } else {
        const speech = 'Sorry, I couldn\'t find any Twitter handle for ' + person;
        assistant.ask(speech);
      }
    });
    // const parameters = {};
    // parameters[PERSON_PARAM] = true;
    // assistant.setContext(LEARN_THING_CONTEXT, 2, parameters);
  }
});
