import { BasicCard, SimpleResponse, Image, Button } from "actions-on-google";

import * as moment from 'moment';
import { returnVideosResponse, returnBasicCard } from "../../shared/responses";
import { YouTubeManager } from './../../../shared/youtube-manager';

export async function findEpisode(conv, params) {
  console.log('params', params);
  const { playlistId } = params;

  if (!playlistId) {

    const items = await YouTubeManager.getLatestShowEpisodes({ limit: 10 });
    console.log('items:', items);
    if (items) {
      const result = items[0];
      if (items.length > 1) {
        returnVideosResponse(conv, true, items);
      } else {
        returnBasicCard(conv, 'video', result);
      }
    } else {
      conv.ask('Sorry, I could not find the show on YouTube');
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
