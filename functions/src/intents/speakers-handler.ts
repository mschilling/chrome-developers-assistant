import { SimpleResponse, BasicCard, Button, Image } from "actions-on-google";

const admin = require('firebase-admin');
const peopleRef = admin.firestore().collection('people');

const api = require('../helpers/api');
const DialogflowOption = require('../helpers/option-helper').DialogflowOptionHelper;

// Context Parameters
const SPEAKER_PARAM = 'speaker';
const SPEAKER_ATTR_PARAM = 'speakerAttribute';
const EVENT_PARAM = 'event';
const PERSON_PARAM = 'person';

export async function speakerInfoHandler(conv, params) {
  const key = params[SPEAKER_PARAM];

  const person = await api.getPerson(key);
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

    conv.ask(new SimpleResponse({
      speech: speech,
      text: speechText
    }));

    conv.ask(new BasicCard({
      title: cardTitle,
      text: cardDescription,
      buttons: new Button({
        url: cardUrl,
        title: cardUrlText
      }),
      image: new Image({
        url: cardPicture,
        alt: cardPictureAltText
      })
    }));

  } else {
    const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
    conv.ask(speech);
  }
}

export async function selectSpeakerByOption(conv, params) {
  console.log('getSelectedOption', conv.getSelectedOption());
  const speakerId = conv.getSelectedOption();
  const person = await api.getPerson(speakerId);

  if (person && person.bio) {
    const speech = `<speak>${person.bio}</speak>`;
    conv.ask(speech);
  } else {
    const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
    conv.ask(speech);
  }
}

export async function speakerSelection(conv, params) {
  const paramEvent = conv.getArgument(EVENT_PARAM);

  const people = await api.getPeople(20);

  if (people && people.length > 0) {
    console.log('Display speakers in carousel. n=' + people.length, people);
    let speechText = 'Here are some speakers';
    const speech = `<speak>${speechText}</speak>`;

    let options = conv.buildCarousel();
    let countOptions = 0;
    for (let i = 0; i < people.length; i++) {
      const doc = people[i];
      if (doc.pictureUrl) {
        countOptions++;
        options = options.addItems(getCarouselOption(doc));
        if (countOptions >= 10) {
          break;
        }
      }
    }
    conv.askWithCarousel(speech, options);
  } else {
    const speech = 'Sorry, I coudn\'t find any speakers right now. Anything else?';
    conv.ask(speech);
  }
}

export async function knownForHandler(conv, params) {
  const key = params[PERSON_PARAM];
  const person = await getPerson(key);

  if (person && person.bio) {
    const speech = `<speak>${person.bio}</speak>`;
    conv.ask(speech);
  } else {
    const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
    conv.ask(speech);
  }
}

export async function handlePersonAttribute(conv, inputParams) {
  const params = parseParameters(inputParams);
  console.log('handlePersonAttribute', params);

  const person = await api.getPerson(params.speaker);
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
    conv.ask(new SimpleResponse({ speech: speech, text: displayText }));
  } else {
    const speech = 'Sorry, I couldn\'t find any';
    conv.ask(speech);
  }
}

function getPerson(key) {
  if (!key) Promise.resolve();

  return peopleRef.doc(key).get().then(function (doc) {
    return doc.data();
  });
}

function getCarouselOption(person) {
  const uniqueId = person.id;
  const cardTitle = `${person.first_name} ${person.last_name}`;
  const cardDescription = person.short_bio || person.bio || 'n.a.';
  const cardPicture = person.pictureUrl || 'http://lorempixel.com/200/400';
  const cardPictureAltText = 'This is my Face';

  const dfo = new DialogflowOption('person#name', cardTitle, null);

  return {
    [dfo.toString()]: {
      synonyms: [
        cardTitle
      ],
      title: cardTitle,
      description: cardDescription,
      image: new Image({
        url: cardPicture,
        alt: cardPictureAltText,
      }),
    }
  }
}

function parseParameters(params) {
  const outputParams = <any>{};
  if (params[SPEAKER_PARAM]) {
    outputParams.speaker = params[SPEAKER_PARAM];
  }

  if (params[SPEAKER_ATTR_PARAM]) {
    outputParams.speakerAttribute = params[SPEAKER_ATTR_PARAM];
  }
  return params;
}
