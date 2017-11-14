'use strict';

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

const api = require('../helpers/api');

// Context Parameters
const EVENT_PARAM = 'event';

function handleAction(assistant) {
  const paramEvent = assistant.getArgument(EVENT_PARAM);

  api.getPeople(10)
    .then(people => {
      if (people && people.length > 0) {
        let speechText = 'Here are some speakers';
        const speech = `<speak>${speechText}</speak>`;

        let options = assistant.buildCarousel();
        for (var i = 0; i < people.length; i++) {
          var doc = people[i];
          if(doc.pictureUrl) {
            options = options.addItems(getCarouselOption(assistant, doc));
          }
        }
        assistant.askWithCarousel(speech, options);
      } else {
        const speech = 'Sorry, I coudn\'t find any speakers right now. Anything else?';
        assistant.ask(speech);
      }
    });
}

function getCarouselOption( assistant, person ) {
  const uniqueId = person.id;
  const cardTitle = `${person.first_name} ${person.last_name}`;
  const cardDescription = person.short_bio || person.bio || 'n.a.';
  const cardPicture = person.pictureUrl || 'http://lorempixel.com/200/400';
  const cardPictureAltText = 'This is my Face';
  const cardUrl = person.homepage;
  const cardUrlText = 'Visit homepage';

  return assistant.buildOptionItem(uniqueId, ['math', 'math and prime', 'prime numbers', 'prime'])
        .setTitle(cardTitle)
        .setDescription(cardDescription)
        .setImage(cardPicture, cardPictureAltText)
}

module.exports = {
    speakerSelection: handleAction,
};
