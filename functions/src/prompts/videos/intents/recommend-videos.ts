const responses = require('../../../helpers/responses');
const youtube = require('../../../helpers/youtube-manager').YouTubeManager;
const DialogflowOption = require('../../../helpers/option-helper').DialogflowOptionHelper;

export async function videoRecommendationHandler(conv, params) {

  const defaultPlaylistId = 'PLJ3pNpJBSfWYehQ4URTAsauypK_QLowul';

  const results = await youtube.getPlaylistVideos(defaultPlaylistId);
  console.log('Number of videos found: ' + (results || []).length);
  if (results && results.length > 0) {
    const result = results[0];
    if (results.length > 1) {
      responses.returnVideosResponse(conv, true, results); // Verify implementation
    } else {
      responses.returnBasicCard(conv, 'video', result); // Verify implementation
    }
  } else {
    conv.ask('Sorry, there\'s no result right now. Please try something else.');
  }
}

export async function selectVideoByOption(conv, params) {
  const optionData = conv.getSelectedOption(); // TODO: verify/check
  console.log('optionData', optionData);
  const dfo = DialogflowOption.fromString(optionData);
  console.log('dfo', dfo);

  if (dfo && dfo.value) {
    const card = await youtube.getVideoById(dfo.value);
    if (card) {
      responses.responseYouTubeVideoAsBasicCard(conv, card); // Verify implementation
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}
