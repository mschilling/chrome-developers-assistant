'use strict';

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

const api = require('../helpers/api');

const KnownForHandler = require('./known-for');
const GithubHandleHandler = require('./github-handle');

// Context Parameters
const PERSON_PARAM = 'person';

function handleAction(assistant) {
  const key = assistant.getArgument(PERSON_PARAM);

  api.getPerson(key)
    .then(person => {
      if (person) {
        let speechText = `${person.first_name} ${person.last_name} is a developer from the Chrome Team`;
        if(person.shortbio) {
          speechText = person.shortbio;
        }
        const speech = `<speak>${speechText}</speak>`;

        const cardTitle = `${person.first_name} ${person.last_name}`;
        const cardDescription = person.shortbio || person.bio || 'n.a.';
        const cardPicture = person.pictureUrl || 'http://lorempixel.com/200/400';
        const cardPictureAltText = 'This is my Face';
        const cardUrl = person.homepage;
        const cardUrlText = 'Visit homepage';

        let response = assistant.buildRichResponse()
          .addSimpleResponse({
            speech: speech,
            displayText: speechText
          })
          .addBasicCard(assistant.buildBasicCard(cardDescription)
            .setTitle(cardTitle)
            .addButton(cardUrlText, cardUrl)
            .setImage(cardPicture, cardPictureAltText)
          );

        assistant.ask(response);
      } else {
        const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
        assistant.ask(speech);
      }
    });
}

module.exports = {
    speakerInfo: handleAction,
    knownFor: KnownForHandler.knownFor,
    githubHandle: GithubHandleHandler.githubHandle
};
