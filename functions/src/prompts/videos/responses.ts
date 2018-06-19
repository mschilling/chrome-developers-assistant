import { Translations as Strings } from "./translations";
import { GenericCard } from './../../models/card';
import { YouTubeVideo } from './../../models/youtube-video';
import { SimpleResponse } from "actions-on-google";
import { buildSimpleCard, buildBrowseCarousel } from '../../utils/responses';
import { YouTubeVideoServiceExt } from '../../services/youtube-video-service';

export function responseYouTubeVideoWithCard(conv, video: YouTubeVideo) {
  const cardData = YouTubeVideoServiceExt.asCard(video);
  responseVideoWithCard(conv, cardData);
}

export function responseYouTubeVideosWithBrowseCarousel(conv, videos: YouTubeVideo[]) {
  const items = YouTubeVideoServiceExt.asCards(videos);
  responseVideosWithBrowseCarousel(conv, items)
}

function responseVideoWithCard(conv, cardData: GenericCard) {
  console.log('Response video with BasicCard', cardData);

  const simpleResponse = new SimpleResponse({
    speech: "Here is a matching video",
    text: "Here is a matching video"
  });
  conv.ask(simpleResponse);

  const simpleCardResponse = buildSimpleCard(cardData);
  conv.ask(simpleCardResponse);
}

function responseVideosWithBrowseCarousel(conv, cardsData: GenericCard[]) {
  console.log('Response videos with Browse Carousel', cardsData);

  conv.ask(Strings.GeneralListResultText);

  const browseCarouselResponse = buildBrowseCarousel(cardsData);
  conv.ask(browseCarouselResponse);
}
