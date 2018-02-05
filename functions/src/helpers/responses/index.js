'use strict';

const moment = require('moment');
const DialogflowOption = require('../option-helper');

function returnVideosResponse(assistant, success, videos) {
  let response;
  if (success && (videos || []).length > 0) {
    const displayText = 'I\'ve found some video\'s on YouTube. Here it is.';
    const speech = `<speak>${displayText}</speak>`;

    const options = buildCarouselForYouTubeVideos(assistant, videos, 3);

    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: speech,
        displayText: displayText
      });
    assistant.askWithCarousel(response, options);
  } else {
    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find the video on YouTube right now.',
        displayText: 'Sorry, I could not find the video on YouTube right now'
      });
    assistant.ask(response);
  }
}

function returnBlogPostsResponse(assistant, success, items) {
  let response;
  if (success && (items || []).length > 0) {
    const displayText = 'I\'ve found some online blogposts. Here it is.';
    const speech = `<speak>${displayText}</speak>`;

    const options = buildCarouselForBlogPosts(assistant, items, 3);

    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: speech,
        displayText: displayText
      });
    assistant.askWithCarousel(response, options);
  } else {
    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find any blogposts right now.',
        displayText: 'Sorry, I could not find any blogposts right now.'
      });
    assistant.ask(response);
  }
}

function buildCarouselForYouTubeVideos(assistant, items, maxLength = 10) {
  if (maxLength > 10) maxLength = 10;
  if (!(items && maxLength > 0)) return;

  console.log('carousel items', items);

  let options = assistant.buildCarousel();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const uniqueId = item.videoId;
    const cardTitle = item.name || item.title;
    const cardDescription = item.description;
    const thumbId = String(Math.ceil(Math.random() * 3));
    const cardPicture = `https://img.youtube.com/vi/${item.videoId}/hq${thumbId}.jpg`;
    const cardPictureAltText = cardTitle;

    const dfo = new DialogflowOption('youtube#video', uniqueId, null);

    const newOption = assistant.buildOptionItem(dfo.toString(), [uniqueId + '_alias'])
      .setTitle(cardTitle)
      .setDescription(cardDescription)
      .setImage(cardPicture, cardPictureAltText);

    options = options.addItems(newOption);
  }
  return options;
}

function buildCarouselForBlogPosts(assistant, items, maxLength = 10) {
  if (maxLength > 10) maxLength = 10;
  if (!(items && maxLength > 0)) return;

  console.log('carousel items', items);

  let options = assistant.buildCarousel();
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const uniqueId = item.id;
    const cardTitle = item.title;
    const cardDescription = `Published ${moment(item.publishDate).fromNow()} by ${item.author}`;
    const cardPicture = item.postImageUrl;
    const cardPictureAltText = 'blog post';

    const dfo = new DialogflowOption('blogpost#id', item.id, 'open');

    const newOption = assistant.buildOptionItem(dfo.toString(), [uniqueId + '_alias'])
      .setTitle(cardTitle)
      .setDescription(cardDescription)
      .setImage(cardPicture, cardPictureAltText)
      ;

    options = options.addItems(newOption);
  }
  return options;
}

function returnVideoResponse(assistant, success, params) {
  let response;
  if (success) {
    const videoId = params.videoId;
    const videoTitle = params.videoTitle || '';
    const url = 'https://www.youtube.com/watch?v=' + videoId;

    const speech = `
      <speak>
        <p>
          <s>I've found a video on YouTube.</s>
          <s>It's called ${videoTitle}.</s>
        </p>
      </speak>`;

    const displayText = 'Here\'s a video I found on YouTube';

    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: speech,
        displayText: displayText
      })
      .addSuggestionLink('video on YouTube', url);
  } else {
    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find the video on YouTube right now.',
        displayText: 'Sorry, I could not find the video on YouTube right now'
      });
  }

  assistant.ask(response);
}

function returnBlogPostResponse(assistant, success, params) {
  let response;
  if (success) {
    const id = params.id;
    const title = params.title || '';
    const url = params.url;

    const speech = `
      <speak>
        <p>
          <s>I've found a blog online.</s>
          <s>It's called ${title}.</s>
        </p>
      </speak>`;

    const displayText = 'Here\'s a blog I found online';

    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: speech,
        displayText: displayText
      })
      .addSuggestionLink('blog', url);
  } else {
    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find the blogpost online right now.',
        displayText: 'Sorry, I could not find the blogpost online right now.'
      });
  }

  assistant.ask(response);
}

function responseIntentKeynoteVideo(assistant, success, params) {
  let response;
  if (success) {
    const videoId = params.videoId;
    const videoTitle = params.videoTitle || '';
    const url = 'https://www.youtube.com/watch?v=' + videoId;

    const speech = `<speak>
        I've found the keynote on YouTube. It's called ${videoTitle}.
        </speak>`;

    const displayText = `I've found "${videoTitle}" on YouTube, here it is.`;

    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: speech,
        displayText: displayText
      })
      .addSuggestionLink('video on YouTube', url);
  } else {
    response = assistant.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find the keynote on YouTube just now.',
        displayText: 'Sorry, I couldn\'t find anything on YouTube right now'
      });
  }

  assistant.ask(response);
}

function responseYouTubeVideoAsBasicCard(assistant, cardData) {
  const publishDate = moment(cardData.publishedAt);
  assistant.ask(assistant.buildRichResponse()
    .addSimpleResponse({
      displayText: 'Here\'s a YouTube result',
      speech: `Here's a matching video. It's called ${cardData.title}`
    })
    .addBasicCard(assistant.buildBasicCard(cardData.description)
      .setTitle(cardData.title)
      .setSubtitle(`Published ${publishDate.fromNow()}`)
      .addButton('Watch on YouTube', 'https://youtube.com/watch?v=' + cardData.videoId)
      .setImage(cardData.imageUrl, cardData.title)
      .setImageDisplay('CROPPED')
    )
  );
}

function returnBasicCard(assistant, cardType, data) {
  console.log('returnBasicCard', cardType, data);
  const card = {};
  let displayText;
  let speech;

  switch (cardType) {
    case 'video':
      displayText = 'Here\'s a YouTube result';
      speech = `Here's a matching video. It's called ${data.name}`;

      const thumbId = String(Math.ceil(Math.random() * 3));
      card.title = data.name;
      card.description = data.description;
      card.imageUrl = `https://img.youtube.com/vi/${data.videoId}/hq${thumbId}.jpg`;
      card.buttonText = 'Watch on YouTube';
      card.buttonUrl = 'https://youtube.com/watch?v=' + data.videoId;
      break;
    case 'blogpost':
      displayText = 'Here\'s a blog post result';
      speech = `Here's a matching blog post by ${data.author}`;

      card.title = `Blog post by ${data.author}`;
      card.description = data.title;
      card.imageUrl = data.postImageUrl;
      card.buttonText = 'Read more';
      card.buttonUrl = data.postUrl;

      if (data.publishDate) {
        card.subtitle = `Published ${moment(data.publishDate).fromNow()}`;
      }
      break;
  }

  let response = assistant.buildRichResponse();

  // Simple Response
  response = response.addSimpleResponse({ displayText: displayText, speech: speech });

  // Basic Card
  let basicCard = assistant.buildBasicCard(card.description)
    .setTitle(card.title)
    .addButton(card.buttonText, card.buttonUrl)
    .setImage(card.imageUrl, card.title)
    .setImageDisplay('CROPPED');

    if (card.subtitle) {
      basicCard = basicCard.setSubtitle(card.subtitle);
    }

  response = response.addBasicCard(basicCard);

  assistant.ask(response);
}

module.exports = {
  returnVideosResponse: returnVideosResponse,
  returnVideoResponse: returnVideoResponse,
  responseIntentKeynoteVideo: responseIntentKeynoteVideo,
  returnBlogPostsResponse: returnBlogPostsResponse,
  returnBlogPostResponse: returnBlogPostResponse,
  responseYouTubeVideoAsBasicCard: responseYouTubeVideoAsBasicCard,
  returnBasicCard: returnBasicCard
};
