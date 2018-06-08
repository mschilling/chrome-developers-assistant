import * as admin from 'firebase-admin';

import { VideoService } from './../../services/video-service';
import { Video } from '../../models/video';

interface IResponse {

}

class Response implements IResponse {
  constructor() {
    //
  };
}

export async function video(conv, inputParams) {
  const videoService = new VideoService(admin.firestore());
  const params = {};
  const videos = await videoService.search(params, 10);

  if (videos.length === 0) {
    //
  } else if (videos.length === 1) {
    return asBasicCard(videos[0]);
  } else if (videos.length > 1) {
    //
  } else {
    // Default response: no results found
  }
  return null;
}

function asBasicCard(data: Video): Response {
  const response = new Response();
  return null;
}

function asCarousel(): Response {
  return null;
}

function asBrowseCarousel(): Response {
  return null;
}
