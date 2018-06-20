import * as util from "util";

import { SimpleResponse } from "actions-on-google";
import { Firestore } from "../../../shared/firestore";
import {
  PeopleService,
  PeopleServiceExt
} from "../../../services/people-service";

import { Translations as Strings } from "./../translations";
import { buildCarousel, buildSimpleCard } from "../../../utils/responses";
import { showOrBrowseSpeakers } from "../responses";

const peopleService = new PeopleService(Firestore.db);

// Context Parameters
const SPEAKER_PARAM = "speaker";
const SPEAKER_ATTR_PARAM = "speakerAttribute";
const PERSON_PARAM = "person";

export async function speakerInfoHandler(conv, params) {
  let key = params[SPEAKER_PARAM];
  if (params[PERSON_PARAM]) {
    key = params[PERSON_PARAM];
  }

  const person = await peopleService.getPerson(key);
  if (person) {
    let speechText = util.format(
      Strings.PersonDefaultWhoIs,
      `${person.first_name} ${person.last_name}`
    );
    if (person.short_bio) {
      speechText = person.short_bio;
    }

    const speech = `<speak>${speechText}</speak>`;

    conv.ask(
      new SimpleResponse({
        speech: speech,
        text: speechText
      })
    );

    const simpleCardResponse = buildSimpleCard(PeopleServiceExt.asCard(person));
    conv.ask(simpleCardResponse);
  } else {
    conv.ask(util.format(Strings.PersonNoInfo, person));
  }
}

export async function selectSpeakerByOption(conv, params) {
  console.log("getSelectedOption", conv.getSelectedOption());
  const speakerId = conv.getSelectedOption();
  const person = await peopleService.getPerson(speakerId);

  if (person && person.bio) {
    const speech = `<speak>${person.bio}</speak>`;
    conv.ask(speech);
  } else {
    conv.ask(util.format(Strings.PersonNoInfo, person));
  }
}

export async function speakerSelection(conv, params) {
  console.log(`Handle intent :: speakerSelection`, conv.actions, params);

  const items = await peopleService.getPeople(20);
  showOrBrowseSpeakers(conv, items);
}

export async function knownForHandler(conv, params) {
  const key = params[PERSON_PARAM];
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
  console.log("handlePersonAttribute", params);

  const person = await peopleService.getPerson(params.speaker);
  if (person) {
    let displayText = "Sorry, I couldn't find it right now.";
    let speech = `<speak>${displayText}</speak>`;

    switch (params.speakerAttribute) {
      case "twitter":
        displayText = `${person.first_name}'s Twitter handle is @${
          person.twitter
        }`;
        speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
        break;
      case "github":
        if (person.github) {
          displayText = `${person.first_name}'s Github handle is ${
            person.github
          }`;
          speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
        }
        break;
      case "homepage":
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
  if (params[SPEAKER_PARAM]) {
    outputParams.speaker = params[SPEAKER_PARAM];
  }

  if (params[SPEAKER_ATTR_PARAM]) {
    outputParams.speakerAttribute = params[SPEAKER_ATTR_PARAM];
  }
  return params;
}
