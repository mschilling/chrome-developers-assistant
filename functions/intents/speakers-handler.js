'use strict';

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

const api = require('../helpers/api');
const DialogflowOption = require('../helpers/option-helper');

// Context Parameters
const SPEAKER_PARAM = 'speaker';
const SPEAKER_ATTR_PARAM = 'speakerAttribute';
const EVENT_PARAM = 'event';
const PERSON_PARAM = 'person';

function speakerInfoHandler(assistant) {
  const key = assistant.getArgument(SPEAKER_PARAM);

  api.getPerson(key)
    .then(person => {
      if (person) {
        let speechText = `${person.first_name} ${person.last_name} is a developer from the Chrome Team`;
        if (person.shortbio) {
          speechText = person.shortbio;
        }
        const speech = `<speak>${speechText}</speak>`;

        const cardTitle = `${person.first_name} ${person.last_name}`;
        const cardDescription = person.short_bio || person.bio || 'n.a.';
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

function selectSpeakerByOption(assistant) {
  console.log('getSelectedOption', assistant.getSelectedOption());
  const speakerId = assistant.getSelectedOption();

  return api.getPerson(speakerId)
    .then(person => {
      if (person && person.bio) {
        const speech = `<speak>${person.bio}</speak>`;
        assistant.ask(speech);
      } else {
        const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
        assistant.ask(speech);
      }
    });
}

function handleSpeakerSelection(assistant) {
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

function knownForHandler(assistant) {
  const key = assistant.getArgument(PERSON_PARAM);
  getPerson(key)
    .then(person => {
      if (person && person.bio) {
        const speech = `<speak>${person.bio}</speak>`;
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

function handlePersonAttribute(assistant) {
  const params = parseParameters(assistant);
  console.log('handlePersonAttribute', params);

  api.getPerson(params.speaker).then((person) => {
    if (person) {
      let displayText = 'Sorry, I couldn\'t find it right now.';
      let speech = `<speak>${displayText}</speak>`;

      switch (params.speakerAttribute) {
        case 'twitter':
          displayText = `${person.first_name}'s Twitter handle is @${person.twitter}`;
          speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
          break;
        case 'github':
          if (person.github) {
            displayText = `${person.first_name}'s Github handle is ${person.github}`;
            speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
          }
          break;
        case 'homepage':
          if (person.homepage) {
            displayText = `${person.first_name}'s personal website is ${person.homepage}`;
            speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
          }
          break;
      }

      assistant.ask(assistant.buildRichResponse()
        .addSimpleResponse({ speech: speech, displayText: displayText }));
    } else {
      const speech = 'Sorry, I couldn\'t find any';
      assistant.ask(speech);
    }
  });
}

function parseParameters(assistant) {
  const speakerParam = assistant.getArgument(SPEAKER_PARAM);
  const speakerAttrParam = assistant.getArgument(SPEAKER_ATTR_PARAM);

  console.log(speakerParam, speakerAttrParam);

  const params = {};

  if (speakerParam) {
    params.speaker = speakerParam;
  }

  if (speakerAttrParam) {
    params.speakerAttribute = speakerAttrParam;
  }
  return params;
}

module.exports = {
  speakerInfoHandler: speakerInfoHandler,
  speakerSelection: handleSpeakerSelection,
  handlePersonAttribute: handlePersonAttribute,
  knownForHandler: knownForHandler,
  selectSpeakerByOption: selectSpeakerByOption
};
