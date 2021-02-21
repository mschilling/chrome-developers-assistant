import { Parameters } from './../../../dialogflow-constants';
import { YouTubeManager } from "./../../../shared/youtube-manager";
import { DialogflowOption } from "../../shared/option-helper";
import { VideoService } from "../../../services/video-service";
import { Firestore } from "../../../shared/firestore";
import { responseVideoResults, responseYouTubeVideoResults } from "../responses";

const videoService = new VideoService(Firestore.db);

export async function searchVideos(conv, inputParams) {
  const params = parseParameters(inputParams);
  console.log("params", params);

  const videos = await videoService.search(params, 10);
  responseVideoResults(conv, videos);
}

export async function selectVideoByOption(conv, params) {
  const optionData = conv.getSelectedOption(); // TODO: verify/check
  console.log("optionData", optionData);
  const dfo = DialogflowOption.fromString(optionData);

  if (dfo && dfo.value) {
    const card = await YouTubeManager.getVideoById(dfo.value);
    responseYouTubeVideoResults(conv, [card]);
  }
  conv.ask("Sorry, I could not find the show on YouTube");
}

function parseParameters(inputParams) {
  const eventParam = inputParams[Parameters.EVENT];
  const tagsParam = inputParams[Parameters.TAGS] || [];
  const speakersParam = inputParams[Parameters.SPEAKERS] || [];

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
