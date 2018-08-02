import * as util from 'util';

import { SimpleResponse } from 'actions-on-google';
import { Firestore } from '../../../shared/firestore';
import { PeopleService } from '../../../services/people-service';

import { Translations as Strings } from './../translations';
import { Parameters } from '../../../dialogflow-constants';

const peopleService = new PeopleService(Firestore.db);

// Context Parameters
const SPEAKER_ATTR_PARAM = 'speakerAttribute';

export async function selectSpeakerByOption(conv, params) {
  console.log('getSelectedOption', conv.getSelectedOption());
  const speakerId = conv.getSelectedOption();
  const person = await peopleService.getPerson(speakerId);

  if (person && person.bio) {
    const speech = `<speak>${person.bio}</speak>`;
    conv.ask(speech);
  } else {
    conv.ask(util.format(Strings.PersonNoInfo, person));
  }
}

export async function knownForHandler(conv, params) {
  const key = params[Parameters.SPEAKER];
  const person = await peopleService.getPerson(key);

  if (person && person.bio) {
    const speech = `<speak>${person.bio}</speak>`;
    conv.ask(speech);
  } else {
    conv.ask(util.format(Strings.PersonNoInfo, person));
  }
}

export async function handlePersonAttribute(conv, inputParams) {
  const params = parseParameters(inputParams);
  console.log('handlePersonAttribute', params);

  const person = await peopleService.getPerson(params.speaker);
  if (person) {
    let displayText = "Sorry, I couldn't find it right now.";
    let speech = `<speak>${displayText}</speak>`;

    switch (params.speakerAttribute) {
      case 'twitter':
        displayText = `${person.first_name}'s Twitter handle is @${
          person.twitter
        }`;
        speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
        break;
      case 'github':
        if (person.github) {
          displayText = `${person.first_name}'s Github handle is ${
            person.github
          }`;
          speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
        }
        break;
      case 'homepage':
        if (person.homepage) {
          displayText = `${person.first_name}'s personal website is ${
            person.homepage
          }`;
          speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
        }
        break;
    }
    conv.ask(new SimpleResponse({ speech: speech, text: displayText }));
  } else {
    const speech = Strings.PersonAttributeNotFoundText;
    conv.ask(speech);
  }
}

function parseParameters(params) {
  const outputParams = <any>{};
  if (params[Parameters.SPEAKER]) {
    outputParams.speaker = params[Parameters.SPEAKER];
  }

  if (params[SPEAKER_ATTR_PARAM]) {
    outputParams.speakerAttribute = params[SPEAKER_ATTR_PARAM];
  }
  return params;
}
