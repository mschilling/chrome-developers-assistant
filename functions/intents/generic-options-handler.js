'use strict';

const api = require('../helpers/api');
const youtube = require('../helpers/youtube-manager');
const responses = require('../helpers/responses');
const DialogflowOption = require('../helpers/option-helper');

function genericOptionsHandler(assistant) {
  const optionData = assistant.getSelectedOption();
  console.log('genericOptionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);

  switch (dfo.type) {
    case 'youtube#video':
      handleVideo(assistant, dfo);
      return;
    case 'blogpost#id':
      handleBlogpost(assistant, dfo);
      return;
  }

  if (dfo && dfo.value) {
    assistant.ask( assistant.buildRichResponse()
    .addSimpleResponse({
      speech: 'Here you go',
      displayText: 'Here you go'
    })
    .addSuggestionLink('blog on website', dfo.value));
    return;
  };
  assistant.ask('Sorry, I could not find the show on YouTube');
}

function handleVideo(assistant, dfo) {
  if (dfo && dfo.value) {
    return youtube.getVideoById(dfo.value)
      .then( (card) => {
        if (card) {
          responses.responseYouTubeVideoAsBasicCard(assistant, card);
          return;
        }
      });
  };
  assistant.ask('Sorry, I could not find the show on YouTube');
}

function handleBlogpost(assistant, dfo) {
  if (dfo && dfo.value) {
    return api.getBlogPostById(dfo.value)
      .then( (data) => {
        if (data) {
          return responses.returnBasicCard(assistant, 'blogpost', data);
        }
      });
  };
  assistant.ask('Sorry, I could not find the show on YouTube');
}

module.exports = {
  handleOption: genericOptionsHandler
};
