'use strict';

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');
const DialogflowOption = require('../helpers/option-helper');

const api = require('../helpers/api');

// Context Parameters
const EVENT_PARAM = 'event';

function handleAction(assistant) {
  const paramEvent = assistant.getArgument(EVENT_PARAM);

  api.getPeople(20)
    .then(people => {
      if (people && people.length > 0) {
        console.log('Display speakers in carousel. n=' + people.length, people);
        let speechText = 'Here are some speakers';
        const speech = `<speak>${speechText}</speak>`;

        let options = assistant.buildCarousel();
        let countOptions = 0;
        for (let i = 0; i < people.length; i++) {
          const doc = people[i];
          if (doc.pictureUrl) {
            countOptions++;
            options = options.addItems(getCarouselOption(assistant, doc));
            if (countOptions >=10) {
              break;
            }
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

  const dfo = new DialogflowOption('person#name', cardTitle, null);

  return assistant.buildOptionItem(dfo.toString(), [cardTitle])
        .setTitle(cardTitle)
        .setDescription(cardDescription)
        .setImage(cardPicture, cardPictureAltText);
}

module.exports = {
    speakerSelection: handleAction,
};
