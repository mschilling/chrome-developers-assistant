'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const EVENT_PARAM = 'summit';
const TAGS_PARAM = 'tags';
const SPEAKERS_PARAM = 'speakers';
// const PERSON_PARAM = 'person';
// const DATE_PERIOD_PARAM = 'date-period';
// const EVENT_PARAM = 'event';

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

function parseParameters(assistant) {
  const eventParam = assistant.getArgument(EVENT_PARAM);
  const tagsParam = assistant.getArgument(TAGS_PARAM) || [];
  const speakersParam = assistant.getArgument(SPEAKERS_PARAM) || [];
  // const speaker = assistant.getArgument(PERSON_PARAM);
  // const datePeriod = assistant.getArgument(DATE_PERIOD_PARAM);
  // const event = assistant.getArgument(EVENT_PARAM);

  console.log(eventParam, tagsParam, speakersParam);

  const params = {};

  if (eventParam) {
    params.event = eventParam;
  }

  if (tagsParam) {
    params.tags = tagsParam;
  }

  if (speakersParam) {
    params.speakers = speakersParam;
  }

  return params;
}

module.exports = {
  handleAction: handleAction
};
