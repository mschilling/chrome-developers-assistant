'use strict';

function responseIntentKeynoteVideo(assistant, success, params) {

  let response;
  if (success) {
    const videoId = params.videoId;
    const videoTitle = params.videoTitle;
    const url = 'https://www.youtube.com/watch?v=' + videoId;

    const speech = `<speak>
        I've found the keynote on YouTube. It's called ${videoTitle}.
        </speak>`;

    const displayText = `I've found the title "${videoTitle}" on YouTube.
    Here's the link: https://www.youtube.com/watch?v=${url}`;

    response = assistant.buildRichResponse()
        .addSimpleResponse({
          speech: speech,
          displayText: displayText
        })
        .addSuggestionLink('Open video on YouTube.', url);

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
  responseIntentKeynoteVideo: responseIntentKeynoteVideo
};
