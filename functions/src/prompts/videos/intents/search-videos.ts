import { YouTubeManager } from "./../../../shared/youtube-manager";
import { responseYouTubeVideoAsBasicCard } from "../../shared/responses";
import { DialogflowOption } from "../../shared/option-helper";
import { VideoService, VideoServiceExt } from "../../../services/video-service";
import { Firestore } from "../../../shared/firestore";
import { buildSimpleCard, buildCarousel, buildBrowseCarousel } from "../../../utils/responses";
import { Translations as Strings } from "../translations";
import { SimpleResponse } from "actions-on-google";

const videoService = new VideoService(Firestore.db);

// Context Parameters
const EVENT_PARAM = "summit";
const TAGS_PARAM = "tags";
const SPEAKERS_PARAM = "speakers";

export async function searchVideos(conv, inputParams) {
  const params = parseParameters(inputParams);
  console.log('params', params);

  const videos = await videoService.search(params, 10);
  if (videos === null) {
    console.log("videos is null");
    conv.ask(Strings.GeneralListNoResultsText);
    return;
  }

  console.log("Number of videos found: " + (videos || []).length);
  if (videos.length > 1) {
    conv.ask(Strings.GeneralListResultText);

    const browseCarouselResponse = buildBrowseCarousel(VideoServiceExt.asCards(videos))
    conv.ask(browseCarouselResponse);

    return;
  } else {

    conv.ask(new SimpleResponse({
      speech: 'Here is a matching video',
      text: 'Here is a matching video'
    }));

    const simpleCardResponse = buildSimpleCard(
      VideoServiceExt.asCard(videos[0])
    );
    conv.ask(simpleCardResponse);
    return;
  }
}

export async function selectVideoByOption(conv, params) {
  const optionData = conv.getSelectedOption(); // TODO: verify/check
  console.log("optionData", optionData);
  const dfo = DialogflowOption.fromString(optionData);
  console.log("dfo", dfo);

  if (dfo && dfo.value) {
    const card = await YouTubeManager.getVideoById(dfo.value);
    if (card) {
      responseYouTubeVideoAsBasicCard(conv, card); // Verify implementation
      return;
    }
  }
  conv.ask("Sorry, I could not find the show on YouTube");
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
