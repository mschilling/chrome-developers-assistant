import { YouTubeManager } from './../../../shared/youtube-manager';
import { returnVideosResponse, returnBasicCard, responseYouTubeVideoAsBasicCard } from '../../shared/responses';
import { DialogflowOption } from '../../shared/option-helper';

export async function videoRecommendationHandler(conv, params) {

  const defaultPlaylistId = 'PLJ3pNpJBSfWYehQ4URTAsauypK_QLowul';

  const results = await YouTubeManager.getPlaylistVideos(defaultPlaylistId);
  console.log('Number of videos found: ' + (results || []).length);
  if (results && results.length > 0) {
    const result = results[0];
    if (results.length > 1) {
      returnVideosResponse(conv, true, results); // Verify implementation
    } else {
      returnBasicCard(conv, 'video', result); // Verify implementation
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
    const card = await YouTubeManager.getVideoById(dfo.value);
    if (card) {
      responseYouTubeVideoAsBasicCard(conv, card); // Verify implementation
      return;
    }
  };
  conv.ask('Sorry, I could not find the show on YouTube');
}
