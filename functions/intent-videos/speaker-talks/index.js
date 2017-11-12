'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const SPEAKERS_PARAM = 'speakers';

function handleAction(assistant) {
  const speakers = assistant.getArgument(SPEAKERS_PARAM);
  console.log(speakers);
  const speakerList = speakers || [];
  api.filterVideosBySpeakers(speakerList, 3)
    .then(results => {
      if (results && results.length > 0) {
        const result = results[0];
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
