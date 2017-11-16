'use strict';

const api = require('../../helpers/api');

// Context Parameters
const SPEAKER_PARAM = 'speaker';
const SPEAKER_ATTR_PARAM = 'speakerAttribute';

function handleAction(assistant) {
  const params = parseParameters(assistant);

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
            displayText = `${person.first_name}'s Github username is ${person.github}`;
            speech = `<speak>${displayText}<break time="1"/>Anything else?</speak>`;
          }
          break;
      }

      assistant.ask(assistant.buildRichResponse()
        .addSimpleResponse({speech: speech, displayText: displayText}));
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
  handleAction: handleAction
};
