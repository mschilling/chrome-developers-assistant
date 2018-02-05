'use strict';

const moment = require('moment');
const ym = require('../helpers/youtube-manager');
const responses = require('../helpers/responses');

function findEpisode(assistant) {
  // const params = parseParameters(assistant);
  const playlistId = assistant.getArgument('playlistId');

  if (!playlistId) {
    // assistant.ask('Sorry, I could not find any show on YouTube');

    return ym.getLatestShowEpisodes({ limit: 10 })
    .then( (items) => {
      console.log('items:', items);
      if (items) {
        const result = items[0];
        if (items.length > 1) {
          return responses.returnVideosResponse(assistant, true, items);
        } else {
          return responses.returnBasicCard(assistant, 'video', result);
        }
      }
      return assistant.ask('Sorry, I could not find the show on YouTube');
      // return;
    });
  } else {
    ym.getLastEpisode(playlistId)
    .then( (card) => {
      if (card) {
        responseBasicCard(assistant, card);
        return;
      }
      assistant.ask('Sorry, I could not find the show on YouTube');
    });
  }

}

function responseBasicCard(assistant, data) {
  const publishDate = moment(data.publishedAt);
  assistant.ask(assistant.buildRichResponse()
    .addSimpleResponse({
      displayText: 'Here\'s the latest and greatest ✌🏼',
      speech: 'Sure, here\'s the latest and greatest'
    })
    .addBasicCard(assistant.buildBasicCard(data.description)
      .setTitle(data.title)
      .setSubtitle(`Published ${publishDate.fromNow()}`)
      .addButton('Watch on YouTube', 'https://youtube.com/v/' + data.videoId)
      .setImage(data.imageUrl, data.title)
      .setImageDisplay('CROPPED')
      )
    );
}

module.exports = {
  findEpisode: findEpisode,
};
