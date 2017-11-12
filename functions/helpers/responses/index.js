'use strict';

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

function returnVideoResponse(assistant, success, params) {
  let response;
  if (success) {
    const videoId = params.videoId;
    const videoTitle = params.videoTitle || '';
    const url = 'https://www.youtube.com/watch?v=' + videoId;

    const speech = `<speak>
        I've found a video on YouTube. It's called ${videoTitle}.
        </speak>`;

    const displayText = 'Here\'s a video I found on YouTube :-)';

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

module.exports = {
  returnVideoResponse: returnVideoResponse,
  responseIntentKeynoteVideo: responseIntentKeynoteVideo
};
