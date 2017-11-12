'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const PERSON_PARAM = 'person';

function handleAction(assistant) {
  const person = assistant.getArgument(PERSON_PARAM);
  api.filterVideosBySpeaker(person)
    .then(result => {
      if (result) {
        const params = {
          videoId: result.videoId,
          videoTitle: result.name
        };
        responses.returnVideoResponse(assistant, true, params);
      } else {
        responses.returnVideoResponse(assistant, false);
      }
    });
}

module.exports = {
  handleAction: handleAction
};
