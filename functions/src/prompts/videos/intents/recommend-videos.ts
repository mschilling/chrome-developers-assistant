import { DialogflowOption } from "../../shared/option-helper";
import { Translations as Strings } from "../translations";
import { buildBrowseCarousel, buildSimpleCard } from "../../../utils/responses";
import { YouTubeManager } from "./../../../shared/youtube-manager";
import { YouTubeVideoServiceExt } from "../../../services/youtube-video-service";
import { SimpleResponse } from "actions-on-google";

export async function videoRecommendationHandler(conv, params) {
  const defaultPlaylistId = "PLJ3pNpJBSfWYehQ4URTAsauypK_QLowul";

  const results = await YouTubeManager.getPlaylistVideos(defaultPlaylistId);
  console.log("Number of videos found: " + (results || []).length);

  if (results === null) {
    console.log("videos is null");
    conv.ask(Strings.GeneralListNoResultsText);
    return;
  }

  if (results.length > 1) {
    conv.ask(Strings.GeneralListResultText);

    const browseCarouselResponse = buildBrowseCarousel(
      YouTubeVideoServiceExt.asCards(results)
    );
    conv.ask(browseCarouselResponse);
    return;
  } else {
    conv.ask(
      new SimpleResponse({
        speech: "Here is a matching video",
        text: "Here is a matching video"
      })
    );

    const simpleCardResponse = buildSimpleCard(
      YouTubeVideoServiceExt.asCard(results[0])
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
      conv.ask(
        new SimpleResponse({
          speech: "Here is a matching video",
          text: "Here is a matching video"
        })
      );

      const simpleCardResponse = buildSimpleCard(
        YouTubeVideoServiceExt.asCard(card)
      );
      conv.ask(simpleCardResponse);
      return;
    }
  }
  conv.ask("Sorry, I could not find the show on YouTube");
}
