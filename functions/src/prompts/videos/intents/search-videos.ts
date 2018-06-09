const api = require('../../../helpers/api');
const responses = require('../../../helpers/responses');

const youtube = require('../../../helpers/youtube-manager').YouTubeManager;
const DialogflowOption = require('../../../helpers/option-helper').DialogflowOptionHelper;

// Context Parameters
const EVENT_PARAM = 'summit';
const TAGS_PARAM = 'tags';
const SPEAKERS_PARAM = 'speakers';

export async function searchVideos(conv, inputParams) {
  const params = parseParameters(inputParams);

  const results = await api.searchVideos(params, 10);

  console.log('Number of videos found: ' + (results || []).length);
  if (results && results.length > 0) {
    const result = results[0];
    if (results.length > 1) {
      responses.returnVideosResponse(conv, true, results); // Verify implementation
    } else {
      responses.returnBasicCard(conv, 'video', result); // Verify implementation
    }
  } else {
    conv.ask('Sorry, there\'s no result right now. Please try something else.');
  }
}

export async function selectVideoByOption(conv, params) {
  const optionData = conv.getSelectedOption(); // TODO: verify/check
  console.log('optionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);
  console.log('dfo', dfo);

  if (dfo && dfo.value) {
    const card = await youtube.getVideoById(dfo.value);
    if (card) {
      responses.responseYouTubeVideoAsBasicCard(conv, card); // Verify implementation
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}


function parseParameters(inputParams) {
  const eventParam = inputParams[EVENT_PARAM];
  const tagsParam = inputParams[TAGS_PARAM] || [];
  const speakersParam = inputParams[SPEAKERS_PARAM] || [];

  console.log(eventParam, tagsParam, speakersParam);

  const params = <any>{};

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
