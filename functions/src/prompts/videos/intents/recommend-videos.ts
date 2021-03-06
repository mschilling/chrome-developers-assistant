import { DialogflowOption } from "../../shared/option-helper";
import { YouTubeManager } from "./../../../shared/youtube-manager";
import {
  responseYouTubeVideoResults
} from "../responses";

export async function videoRecommendationHandler(conv, params) {
  const defaultPlaylistId = "PLJ3pNpJBSfWYehQ4URTAsauypK_QLowul";

  const results = await YouTubeManager.getPlaylistVideos(defaultPlaylistId);
  console.log("videoRecommendationHandler :: number of videos found: " + results.length);
  responseYouTubeVideoResults(conv, results);
}

export async function selectVideoByOption(conv, params) {
  const optionData = conv.getSelectedOption(); // TODO: verify/check
  console.log("optionData", optionData);
  const dfo = DialogflowOption.fromString(optionData);
  console.log("dfo", dfo);

  if (dfo && dfo.value) {
    const card = await YouTubeManager.getVideoById(dfo.value);
    responseYouTubeVideoResults(conv, [card]);
  }
  conv.ask("Sorry, I could not find the show on YouTube");
}
