import {
  SimpleResponse,
  BasicCard,
  Button,
  Image,
  Carousel
} from "actions-on-google";

import * as util from "util";

import { DialogflowOption } from "../../shared/option-helper";
import { Firestore } from "../../../shared/firestore";
import { PeopleService, PeopleServiceExt } from "../../../services/people-service";

import { Translations as Strings } from "./../translations";
import { Person } from "../../../models/person";

const peopleService = new PeopleService(Firestore.db);

// Context Parameters
const SPEAKER_PARAM = "speaker";
const SPEAKER_ATTR_PARAM = "speakerAttribute";
const PERSON_PARAM = "person";

export async function speakerInfoHandler(conv, params) {
  let key = params[SPEAKER_PARAM];
  if(params[PERSON_PARAM]) {
    key = params[PERSON_PARAM];
  }

  const person = await peopleService.getPerson(key);
  if (person) {
    let speechText = util.format(Strings.PersonDefaultWhoIs, `${person.first_name} ${ person.last_name }`);
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

    conv.ask(personAsSimpleCard(person));
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

  const people = await peopleService.getPeople(20);

  if (people && people.length > 0) {
    console.log("Display speakers in carousel. n=" + people.length, people);

    let countOptions = 0;
    let options = {};
    for (const p of people) {
      const person = <any>p;
      if (person.pictureUrl) {
        countOptions++;
        const option = getCarouselOption(person);
        options = { ...options, ...option };

        if (countOptions >= 10) {
          break;
        }
      }
    }
    console.log("speakers options", options);

    conv.ask(Strings.GeneralListResultText);
    conv.ask(new Carousel({ items: options }));
  } else {
    conv.ask(Strings.GeneralListNoResultsText);
  }
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

function getCarouselOption(person) {

  const cardData = PeopleServiceExt.asCard(person);
  const dfo = new DialogflowOption("person#name", cardData.title, null);
  console.log("dfo", dfo);

  return {
    [dfo.toString()]: {
      synonyms: [cardData.title],
      title: cardData.title,
      description: cardData.description,
      image: new Image({
        url: cardData.imageUrl,
        alt: cardData.imageAlt
      })
    }
  };
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

function personAsSimpleCard(person: Person) {
  const cardData = PeopleServiceExt.asCard(person);

  return new BasicCard({
    title: cardData.title,
    text: cardData.description,
    buttons: new Button({
      url: cardData.buttonUrl,
      title: cardData.buttonTitle
    }),
    image: new Image({
      url: cardData.imageUrl,
      alt: cardData.imageAlt
    })
  });
}
