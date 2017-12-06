'use strict';

const moment = require('moment');

function returnVideosResponse(assistant, success, videos, params) {
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
    // .addSuggestionLink('video on YouTube', url);
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

function returnBlogPostsResponse(assistant, success, items, params) {
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
    const cardTitle = item.name;
    const cardDescription = item.description;
    const thumbId = String(Math.ceil(Math.random() * 3));
    const cardPicture = `https://img.youtube.com/vi/${item.videoId}/hq${thumbId}.jpg`;
    const cardPictureAltText = item.name;
    // const cardUrl = 'https://www.youtube.com/watch?v=' + item.videoId;
    // const cardUrlText = 'Visit homepage';

    const newOption = assistant.buildOptionItem(uniqueId, [uniqueId + '_alias'])
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

    const newOption = assistant.buildOptionItem(uniqueId, [uniqueId + '_alias'])
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

module.exports = {
  returnVideosResponse: returnVideosResponse,
  returnVideoResponse: returnVideoResponse,
  responseIntentKeynoteVideo: responseIntentKeynoteVideo,
  returnBlogPostsResponse: returnBlogPostsResponse,
  returnBlogPostResponse: returnBlogPostResponse
};
