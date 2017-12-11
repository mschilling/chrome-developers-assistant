'use strict';

const api = require('../helpers/api');
const responses = require('../helpers/responses');

const youtube = require('../helpers/youtube-manager');
const DialogflowOption = require('../helpers/option-helper');

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
        if (results.length > 1) {
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
  const optionData = assistant.getSelectedOption();
  console.log('optionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);
  console.log('dfo', dfo);

  if (dfo && dfo.value) {
    return youtube.getVideoById(dfo.value)
      .then( (card) => {
        if (card) {
          responses.responseYouTubeVideoAsBasicCard(assistant, card);
          return;
        }
      });
  };
  assistant.ask('Sorry, I could not find the show on YouTube');
}


function parseParameters(assistant) {
  const eventParam = assistant.getArgument(EVENT_PARAM);
  const tagsParam = assistant.getArgument(TAGS_PARAM) || [];
  const speakersParam = assistant.getArgument(SPEAKERS_PARAM) || [];

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
  searchVideos: handleAction,
  selectVideoByOption: selectVideoByOption
};
