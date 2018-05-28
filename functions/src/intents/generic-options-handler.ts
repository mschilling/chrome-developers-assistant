const api = require('../helpers/api');
const youtube = require('../helpers/youtube-manager').YouTubeManager;
const responses = require('../helpers/responses');
const DialogflowOption = require('../helpers/option-helper').DialogflowOptionHelper;
const Str = require('../strings');

export async function handleOption(conv, params, option) {
  // const optionData = assistant.getSelectedOption();
  const optionData = option;
  console.log('genericOptionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);

  switch (dfo.type) {
    case 'youtube#video':
      return handleVideo(conv, dfo);
    case 'blogpost#id':
      return handleBlogpost(conv, dfo);
    case 'person#name':
      return conv.ask(`${dfo.value} is a member of the Chrome Team. More information coming soon.`);
  }
  conv.ask(Str.OPTION_SELECT_NO_RESULT.TEXT);
}

async function handleVideo(conv, dfo) {
  if (dfo && dfo.value) {
    const card = await youtube.getVideoById(dfo.value);
    if (card) {
      responses.responseYouTubeVideoAsBasicCard(conv, card); // TODO: check/verify
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}

async function handleBlogpost(conv, dfo) {
  if (dfo && dfo.value) {
    const data = await api.getBlogPostById(dfo.value);
    if (data) {
      responses.returnBasicCard(conv, 'blogpost', data);
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}
