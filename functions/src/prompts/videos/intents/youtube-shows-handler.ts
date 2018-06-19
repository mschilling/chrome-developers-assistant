import * as moment from 'moment';

import { BasicCard, SimpleResponse, Image, Button } from "actions-on-google";
import { YouTubeManager } from './../../../shared/youtube-manager';
import { buildBrowseCarousel, buildSimpleCard } from '../../../utils/responses';
import { YouTubeVideoServiceExt } from '../../../services/youtube-video-service';
import { Translations as Strings } from "../translations";

export async function findEpisode(conv, params) {
  console.log('params', params);
  const { playlistId } = params;

  if (!playlistId) {

    const items = await YouTubeManager.getLatestShowEpisodes({ limit: 10 });
    console.log('items:', items);


    if (items === null) {
      console.log("videos is null");
      conv.ask(Strings.GeneralListNoResultsText);
      return;
    }

    if (items.length > 1) {
      conv.ask(Strings.GeneralListResultText);

      const browseCarouselResponse = buildBrowseCarousel(
        YouTubeVideoServiceExt.asCards(items)
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
        YouTubeVideoServiceExt.asCard(items[0])
      );
      conv.ask(simpleCardResponse);
      return;
    }






  } else {
    const card = await YouTubeManager.getLastEpisode(playlistId);
    if (card) {
      responseBasicCard(conv, card);
    } else {
      conv.ask('Sorry, I could not find the show on YouTube');
    }
  }
}

function responseBasicCard(conv, data) {
  const publishDate = moment(data.publishedAt);
  conv.ask(new SimpleResponse({
    text: 'Here\'s the latest and greatest ✌🏼',
    speech: 'Sure, here\'s the latest and greatest'
  }));

  conv.ask(new BasicCard({
    text: data.description,
    title: data.title,
    subtitle: `Published ${publishDate.fromNow()}`,
    buttons: new Button({
      title: 'Watch on YouTube',
      url: 'https://youtube.com/v/' + data.videoId
    }),
    image: new Image({
      url: data.imageUrl,
      alt: data.title
    }),
    display: 'CROPPED'
  }));

}
