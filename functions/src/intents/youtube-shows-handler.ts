import { BasicCard, SimpleResponse, Image, Button } from "actions-on-google";

const moment = require('moment');
const ym = require('../helpers/youtube-manager').YouTubeManager;
const responses = require('../helpers/responses');

export async function findEpisode(conv, params) {
  console.log('params', params);
  const { playlistId } = params;

  if (!playlistId) {

    return ym.getLatestShowEpisodes({ limit: 10 })
      .then((items) => {
        console.log('items:', items);
        if (items) {
          const result = items[0];
          if (items.length > 1) {
            responses.returnVideosResponse(conv, true, items);
          } else {
            responses.returnBasicCard(conv, 'video', result);
          }
        }
        conv.ask('Sorry, I could not find the show on YouTube');
      });
  } else {
    return ym.getLastEpisode(playlistId)
      .then((card) => {
        if (card) {
          responseBasicCard(conv, card);
        }
        conv.ask('Sorry, I could not find the show on YouTube');
      });
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
