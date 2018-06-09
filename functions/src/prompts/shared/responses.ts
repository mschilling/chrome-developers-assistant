// const moment = require('moment');
import * as moment from 'moment';
import { SimpleResponse, BrowseCarouselItem, Image, BrowseCarousel, Carousel, LinkOutSuggestion, BasicCard, Button } from 'actions-on-google';
import { DialogflowOption } from './option-helper';

export function returnVideosResponse(conv, success, videos) {
  let response;
  if (success && (videos || []).length > 0) {
    const displayText = 'I\'ve found some video\'s on YouTube. Here it is.';
    const speech = `<speak>${displayText}</speak>`;

    const options = buildCarouselForYouTubeVideos(videos, 3);

    conv.ask(new SimpleResponse({
      speech: speech,
      text: displayText
    }));

    conv.ask(new Carousel({ items: options }));

  } else {
    response = conv.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find the video on YouTube right now.',
        displayText: 'Sorry, I could not find the video on YouTube right now'
      });
    conv.ask(response);
  }
}

export function returnBlogPostsResponse(conv, success, items) {
  let response;
  if (success && (items || []).length > 0) {
    const displayText = 'I\'ve found some online blogposts. Here it is.';
    const speech = `<speak>${displayText}</speak>`;

    conv.ask(new SimpleResponse({
      speech: speech,
      text: displayText
    }))

    const options = buildBrowsingCarouselForBlogPosts(items, 3);

    conv.ask(new BrowseCarousel({
      items: options
    }));
  } else {
    response = conv.buildRichResponse()
      .addSimpleResponse({
        speech: 'Sorry, I could not find any blogposts right now.',
        displayText: 'Sorry, I could not find any blogposts right now.'
      });
    conv.ask(response);
  }
}

export function buildCarouselForYouTubeVideos(items, inputMaxLength = 10) {
  let maxLength = inputMaxLength;
  if (maxLength > 10) maxLength = 10;
  if (!(items && maxLength > 0)) return null;

  console.log('carousel items', items);
  let carouselItems = {};

  for (const item of items) {
    const uniqueId = item.videoId;
    const cardTitle = item.name || item.title;
    const cardDescription = item.description;
    const thumbId = String(Math.ceil(Math.random() * 3));
    const cardPicture = `https://img.youtube.com/vi/${item.videoId}/hq${thumbId}.jpg`;
    const cardPictureAltText = cardTitle;

    const dfo = new DialogflowOption('youtube#video', uniqueId, null);

    const newOption = {
      // Add the first item to the carousel
      [dfo.toString()]: {
        synonyms: [
          uniqueId + '_alias'
        ],
        title: cardTitle,
        description: cardDescription,
        image: new Image({
          url: cardPicture,
          alt: cardPictureAltText,
        }),
      }

    }
    carouselItems = { ...carouselItems, ...newOption }
  }

  return carouselItems;
}

export function buildBrowsingCarouselForBlogPosts(items, inputMaxLength = 10) {
  let maxLength = inputMaxLength;
  if (maxLength > 10) maxLength = 10;
  if (!(items && maxLength > 0)) return null;

  console.log('browse carousel items', items);

  const browseCarouselItems: BrowseCarouselItem[] = [];

  for (const item of items) {
    const cardTitle = item.title;
    const cardUrl = item.postUrl;
    const cardDescription = `Published ${moment(item.publishDate).fromNow()} by ${item.author}`;
    const cardPicture = item.postImageUrl;
    const cardPictureAltText = item.title;

    const newOption = new BrowseCarouselItem({
      title: cardTitle,
      url: cardUrl,
      description: cardDescription,
      image: new Image({
        url: cardPicture,
        alt: cardPictureAltText
      })
    });


    browseCarouselItems.push(newOption)
  }

  return browseCarouselItems;
}

export function returnVideoResponse(conv, success, params) {
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

    conv.ask(new SimpleResponse({
      speech: speech,
      text: displayText
    }))

    // .addSuggestionLink('video on YouTube', url);
    conv.add(new LinkOutSuggestion({
      name: 'video on YouTube',
      url: url
    }));
  } else {
    response = conv.ask(new SimpleResponse({
      speech: 'Sorry, I could not find the video on YouTube right now.',
      text: 'Sorry, I could not find the video on YouTube right now'
    }));
  }

  conv.ask(response);
}

export function returnBlogPostResponse(conv, success, params) {
  if (success) {
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

    conv.ask(new SimpleResponse({
      speech: speech,
      text: displayText
    }));

    // .addSuggestionLink('blog', url);
    conv.add(new LinkOutSuggestion({
      name: 'blog',
      url: url
    }));

  } else {
    conv.ask(new SimpleResponse({
      speech: 'Sorry, I could not find the blogpost online right now.',
      text: 'Sorry, I could not find the blogpost online right now.'
    }));
  }

  conv.ask("Sorry, I could not find any blogposts right now");
}

export function responseIntentKeynoteVideo(conv, success, params) {
  if (success) {
    const videoId = params.videoId;
    const videoTitle = params.videoTitle || '';
    const url = 'https://www.youtube.com/watch?v=' + videoId;

    const speech = `<speak>
        I've found the keynote on YouTube. It's called ${videoTitle}.
        </speak>`;

    const displayText = `I've found "${videoTitle}" on YouTube, here it is.`;

    conv.ask(new SimpleResponse({
      speech: speech,
      text: displayText
    }));

    // .addSuggestionLink('video on YouTube', url);
    conv.add(new LinkOutSuggestion({
      name: 'video on YouTube',
      url: url
    }));

  } else {
    conv.ask(new SimpleResponse({
      speech: 'Sorry, I could not find the keynote on YouTube just now.',
      text: 'Sorry, I couldn\'t find anything on YouTube right now'
    }));
  }

  conv.ask("Sorry, I could not find any right now");
}

export function responseYouTubeVideoAsBasicCard(conv, cardData) {
  const publishDate = moment(cardData.publishedAt);
  conv.ask(new SimpleResponse({
    text: 'Here\'s a YouTube result',
    speech: `Here's a matching video. It's called ${cardData.title}`
  }));

  conv.ask(new BasicCard({
    text: cardData.description,
    title: cardData.title,
    subtitle: `Published ${publishDate.fromNow()}`,
    buttons: new Button({
      title: 'Watch on YouTube',
      url: 'https://youtube.com/watch?v=' + cardData.videoId
    }),
    image: new Image({
      url: cardData.imageUrl,
      alt: cardData.title
    }),
    display: 'CROPPED'
  }))
}

export function returnBasicCard(conv, cardType, data) {
  console.log('returnBasicCard', cardType, data);
  const card = <any>{};
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


  // Simple Response
  conv.ask(new SimpleResponse({ text: displayText, speech: speech }));

  // Basic Card
  const basicCard = new BasicCard({
    text: card.description,
    title: card.title,
    buttons: new Button({
      title: card.buttonText,
      url: card.buttonUrl
    }),
    image: new Image({
      url: card.imageUrl,
      alt: card.title
    }),
    display: 'CROPPED'
  });

  if (card.subtitle) {
    basicCard.subtitle = card.subtitle;
  }

  conv.ask(basicCard);
}
