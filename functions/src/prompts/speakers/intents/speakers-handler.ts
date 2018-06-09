import { SimpleResponse, BasicCard, Button, Image, Carousel } from "actions-on-google";

import { DataApi as api } from "../../../shared/data-api";
import { DialogflowOption } from "../../shared/option-helper";

// Context Parameters
const SPEAKER_PARAM = 'speaker';
const SPEAKER_ATTR_PARAM = 'speakerAttribute';
const PERSON_PARAM = 'person';

export async function speakerInfoHandler(conv, params) {
  const key = params[SPEAKER_PARAM];

  const person: any = await api.getPerson(key);
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
  const person: any = await api.getPerson(speakerId);

  if (person && person.bio) {
    const speech = `<speak>${person.bio}</speak>`;
    conv.ask(speech);
  } else {
    const speech = 'There isn\'t much I can tell you about ' + person + ' right know..';
    conv.ask(speech);
  }
}

export async function speakerSelection(conv, params) {
  console.log(`Handle intent :: speakerSelection`, conv.actions, params);

  const people = await api.getPeople(20);

  if (people && people.length > 0) {
    console.log('Display speakers in carousel. n=' + people.length, people);
    const speechText = 'Here are some speakers';
    const speech = `<speak>${speechText}</speak>`;

    let countOptions = 0;
    let options = {};
    for (const p of people) {
      const person = <any>p;
      if (person.pictureUrl) {
        countOptions++;
        const option = getCarouselOption(person);
        options = { ...options, ...option }

        if (countOptions >= 10) {
          break;
        }
      }
    }
    console.log('speakers options', options);

    conv.ask(speech)
    conv.ask(new Carousel({ items: options }))
  } else {
    const speech = 'Sorry, I coudn\'t find any speakers right now. Anything else?';
    conv.ask(speech);
  }
}

export async function knownForHandler(conv, params) {
  const key = params[PERSON_PARAM];
  const person: any = await api.getPerson(key);

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

  const person: any = await api.getPerson(params.speaker);
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

// function getPerson(key) {
//   if (!key) Promise.resolve();

//   return peopleRef.doc(key).get().then(function (doc) {
//     return doc.data();
//   });
// }

function getCarouselOption(person) {
  const cardTitle = `${person.first_name} ${person.last_name}`;
  const cardDescription = person.short_bio || person.bio || 'n.a.';
  const cardPicture = person.pictureUrl || 'http://lorempixel.com/200/400';
  const cardPictureAltText = cardTitle;

  const dfo = new DialogflowOption('person#name', cardTitle, null);
  console.log('dfo', dfo);

  const option = {
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
  console.log('option', option);

  return option;
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