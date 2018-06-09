import { YouTubeManager } from './../../../shared/youtube-manager';
import { DataApi as api } from "../../../shared/data-api";
import { returnVideosResponse, returnBasicCard, responseYouTubeVideoAsBasicCard } from "../../shared/responses";
import { DialogflowOption } from "../../shared/option-helper";

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
      returnVideosResponse(conv, true, results); // Verify implementation
    } else {
      returnBasicCard(conv, 'video', result); // Verify implementation
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
    const card = await YouTubeManager.getVideoById(dfo.value);
    if (card) {
      responseYouTubeVideoAsBasicCard(conv, card); // Verify implementation
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
