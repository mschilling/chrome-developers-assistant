'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const EVENT_PARAM = 'summit';
const TAGS_PARAM = 'tags';

function handleAction(assistant) {
  const params = parseParameters(assistant);

  api.searchVideos(params, 5)
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

function parseParameters( assistant ) {
  const eventParam = assistant.getArgument(EVENT_PARAM);
  const tagsParam = assistant.getArgument(TAGS_PARAM) || [];
  console.log(eventParam, tagsParam)

  const params = {}

  if(eventParam) {
    params.event = eventParam;
  }

  if(tagsParam) {
    params.tags = tagsParam;
  }

  return params;
}

module.exports = {
  handleAction: handleAction
};
