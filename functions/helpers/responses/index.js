'use strict';

function responseYouTubeVideos(assistant, success, params) {
  let response;
  if (success) {

    const displayText = 'I\'ve found some video\'s on YouTube. Here it is.';
    const speech = `<speak>${displayText}</speak>`;

    // let videos = params.videos || [];
    //   videos.forEach( vid => {
    //   const videoId = params.videoId;
    //   const videoTitle = params.videoTitle || '';
    //   const url = 'https://www.youtube.com/watch?v=' + videoId;
    // })

    // response = assistant.buildRichResponse()
    //     .addSimpleResponse({
    //       speech: speech,
    //       displayText: displayText
    //     })
    //     .addSuggestionLink('video on YouTube', url);

    let options = assistant.buildCarousel();

    for (let i=0; i<5; i++) {
      options = options.addItems(assistant.buildOptionItem('MATH_AND_PRIME_' + i,
        ['math', 'math and prime', 'prime numbers', 'prime'])
        .setTitle('Math & prime numbers ' + i)
        .setDescription('42 is an abundant number because the sum of its ' +
          'proper divisors 54 is greater…')
        .setImage('http://example.com/math_and_prime.jpg', 'Math & prime numbers'))
    }

    assistant.askWithCarousel('Alright! Here are a few things you can learn. Which sounds interesting?',
      options
    );
  } else {
    response = assistant.buildRichResponse()
    .addSimpleResponse({
      speech: 'Sorry, I could not find the keynote on YouTube just now.',
      displayText: 'Sorry, I couldn\'t find anything on YouTube right now'
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

function returnVideoResponse(assistant, success, params) {
  let response;
  if (success) {
    const videoId = params.videoId;
    const videoTitle = params.videoTitle || '';
    const url = 'https://www.youtube.com/watch?v=' + videoId;

    const speech = `<speak>
        I've found a video YouTube. It's called ${videoTitle}.
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
  responseYouTubeVideos: responseYouTubeVideos,
  returnVideoResponse: returnVideoResponse,
  responseIntentKeynoteVideo: responseIntentKeynoteVideo
};
