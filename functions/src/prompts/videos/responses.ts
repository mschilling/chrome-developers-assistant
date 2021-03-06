import { Translations as Strings } from './translations';
import { GenericCard } from './../../models/card';
import { YouTubeVideo } from './../../models/youtube-video';
import { SimpleResponse } from 'actions-on-google';
import { buildSimpleCard, buildBrowseCarousel, buildCarousel } from '../../utils/responses';
import { YouTubeVideoServiceExt } from '../../services/youtube-video-service';
import { Video } from '../../models/video';
import { VideoServiceExt } from '../../services/video-service';
import { Capabilities } from '../../utils/capabilities';

export function responseVideoResults(conv, videos: Video[]) {
  const results = VideoServiceExt.asCards(videos);
  if (results === null) {
    console.log('videos is null');
    conv.ask(Strings.GeneralListNoResultsText);
    return;
  }

  if (results.length > 1) {
    responseVideosWithBrowseCarousel(conv, results);
  } else {
    responseVideoWithCard(conv, results[0]);
  }
}

export function responseYouTubeVideoResults(conv, videos: YouTubeVideo[]) {
  const results = YouTubeVideoServiceExt.asCards(videos);
  if (results === null) {
    console.log('videos is null');
    conv.ask(Strings.GeneralListNoResultsText);
    return;
  }

  if (results.length > 1) {
    responseVideosWithBrowseCarousel(conv, results);
  } else {
    responseVideoWithCard(conv, results[0]);
  }
}

export function responseYouTubeVideoWithCard(conv, video: YouTubeVideo) {
  const cardData = YouTubeVideoServiceExt.asCard(video);
  responseVideoWithCard(conv, cardData);
}

export function responseYouTubeVideosWithBrowseCarousel(conv, videos: YouTubeVideo[]) {
  const items = YouTubeVideoServiceExt.asCards(videos);
  responseVideosWithBrowseCarousel(conv, items);
}

function responseVideoWithCard(conv, cardData: GenericCard) {
  console.log('Response video with BasicCard', cardData);

  const simpleResponse = new SimpleResponse({
    speech: 'Here is a matching video. Anything else I can do for you?',
    text: 'Here is a matching video',
  });
  conv.ask(simpleResponse);

  const simpleCardResponse = buildSimpleCard(cardData);
  conv.ask(simpleCardResponse);
}

function responseVideosWithBrowseCarousel(conv, cardsData: GenericCard[]) {
  console.log('Response videos with Browse Carousel', cardsData);

  const surfaceCapabilities = conv.capabilities as Capabilities;

  if (surfaceCapabilities.hasScreen && surfaceCapabilities.hasWebBrowser) {
    conv.ask(Strings.GeneralListResultText);

    const browseCarouselResponse = buildBrowseCarousel(cardsData);
    conv.ask(browseCarouselResponse);
  } else if (surfaceCapabilities.hasScreen) {
    const simpleResponse = new SimpleResponse({
      speech: 'I can only show the results on a web browser compatible device',
      text: 'Results can not be displayed on this device.',
    });
    conv.ask(simpleResponse);

    // conv.ask(Strings.GeneralListResultText);
    // conv.ask(buildCarousel(cardsData));

  } else {
    conv.ask('I can only show the results on a web browser compatible device');
  }
}
