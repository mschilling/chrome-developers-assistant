'use strict';

const admin = require('firebase-admin');
const people = admin.firestore().collection('people');

// Context Parameters
const PERSON_PARAM = 'person';

function twitterHandle(assistant) {

    const person = assistant.getArgument(PERSON_PARAM);
    people.doc(person).get().then(function(doc) {
        if (doc.exists) {
            const data = doc.data();
            const speech = `<speak>
                ${data.first_name}'s twitter handle is @${data.twitter} <break time="2"/>
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

module.exports = {
  twitterHandle: twitterHandle
};
