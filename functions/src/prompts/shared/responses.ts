import * as moment from 'moment';
import { SimpleResponse, Image, LinkOutSuggestion, BasicCard, Button } from 'actions-on-google';

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
