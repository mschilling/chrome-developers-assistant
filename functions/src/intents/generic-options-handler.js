'use strict';

const api = require('../helpers/api');
const youtube = require('../helpers/youtube-manager').YouTubeManager;
const responses = require('../helpers/responses');
const DialogflowOption = require('../helpers/option-helper').DialogflowOptionHelper;
const Str = require('../strings');

function genericOptionsHandler(assistant) {
  const optionData = assistant.getSelectedOption();
  console.log('genericOptionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);

  switch (dfo.type) {
    case 'youtube#video':
      return handleVideo(assistant, dfo);
    case 'blogpost#id':
      return handleBlogpost(assistant, dfo);
    case 'person#name':
      return assistant.ask(`${dfo.value} is a member of the Chrome Team. More information coming soon.`);
  }
  assistant.ask(Str.OPTION_SELECT_NO_RESULT.TEXT);
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
