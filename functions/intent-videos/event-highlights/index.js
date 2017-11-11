'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const EVENT_PARAM = 'event';

function handleAction(assistant) {
  const eventKey = assistant.getArgument(EVENT_PARAM);
  api.searchEventHighlightsVideo(eventKey)
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
