'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const EVENT_PARAM = 'summit';
const TAGS_PARAM = 'tags';
const SPEAKERS_PARAM = 'speakers';

function handleAction(assistant) {
  const params = parseParameters(assistant);

  api.searchVideos(params, 10)
    .then(results => {
      console.log('Number of videos found: ' + (results || []).length);
      if (results && results.length > 0) {
        const result = results[0];
        const videoParams = {
          videoId: result.videoId,
          videoTitle: result.name
        };
        if (params.speakers && params.speakers.length > 0 && results.length >= 4) {
          responses.returnVideosResponse(assistant, true, results, videoParams);
        } else {
          responses.returnVideoResponse(assistant, true, videoParams);
        }
      } else {
        responses.returnVideoResponse(assistant, false);
      }
    });
}

function selectVideoByOption(assistant) {
  const videoId = assistant.getSelectedOption();

  if (videoId) {
    const url = 'https://www.youtube.com/watch?v=' + videoId;
    const displayText = 'Here\'s a video I found on YouTube';

    assistant.ask( assistant.buildRichResponse()
      .addSimpleResponse({
        speech: displayText,
        displayText: displayText
      })
      .addSuggestionLink('video on YouTube', url));
  } else {
    app.ask('Sorry, I couldn\'t find the video 😥');
  }
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
  handleAction: handleAction,
  selectVideoByOption: selectVideoByOption
};
