import * as moment from 'moment';

import { YouTubeManager } from './../../../shared/youtube-manager';
import { responseYouTubeVideoResults } from '../responses';

export async function findEpisode(conv, params) {
  console.log('params', params);
  const { playlistId } = params;

  if (!playlistId) {
    const items = await YouTubeManager.getLatestShowEpisodes({ limit: 10 });
    console.log('items:', items);
    responseYouTubeVideoResults(conv, items);
  } else {
    const card = await YouTubeManager.getLastEpisode(playlistId);
    responseYouTubeVideoResults(conv, [card]); // TODO: null-check
  }
}
