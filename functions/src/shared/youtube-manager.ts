import { ShowService } from './../services/shows-service';
require('dotenv').config({silent: true});

import { debug } from './debug';

import * as functions from 'firebase-functions';
import { Firestore } from './firestore';
import { YouTubeVideo } from '../models/youtube-video';
import { GenericCard } from '../models/card';

const axios = require('axios');
// const api = require('../helpers/api');

const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const ACCESS_TOKEN = process.env.YOUTUBE_KEY || functions.config().youtube.key;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  // headers: {'Authorization': 'Bearer ' + ACCESS_TOKEN}
});

// class OpenGraphObject {
//   static asYouTubeVideo(data) {
//     const obj = {
//       kind: 'youtube#video',
//       id: data.id,
//       title: data.snippet.title,
//       description: data.snippet.description,
//       imageUrl: data.snippet.thumbnails.high.url,
//       publishedAt: data.snippet.publishedAt,
//       videoId: data.contentDetails.videoId ||data.id
//     };
//     return obj;
//   }
// }

export class YouTubeManager {

  static getVideoById(videoId): Promise<YouTubeVideo> {
    debug('getVideoById', videoId);

    return client.get('/videos', {
      params: {
        'maxResults': '5',
        'part': 'snippet,contentDetails',
        'id': videoId,
        'key': ACCESS_TOKEN
      }
    })
      .then((response) => {
        const items = response.data.items || [];
        if (items.length > 0) {
          return YouTubeManager.asYouTubeVideo(items[0]);
        }
        return null;
      });
  }

  static getLastEpisode(playlistId): Promise<YouTubeVideo> {
    debug('getLastEpisode', playlistId);

    return client.get('/playlistItems', {
      params: {
        'maxResults': '5',
        'part': 'snippet,contentDetails',
        'playlistId': playlistId,
        'key': ACCESS_TOKEN
      }
    })
      .then((response) => {
        const items = response.data.items || [];
        if (items.length > 0) {
          return YouTubeManager.asYouTubeVideo(items[0]);
        }
        return null;
      });
  }

  static getPlaylistVideos(playlistId): Promise<YouTubeVideo[]> {
    debug('getPlaylistVideos', playlistId);

    return client.get('/playlistItems', {
      params: {
        'maxResults': '10',
        'part': 'snippet,contentDetails',
        'playlistId': playlistId,
        'key': ACCESS_TOKEN
      }
    })
      .then((response) => {
        const items = response.data.items || [];
        if (items.length > 0) {
          const docs: YouTubeVideo[] = [];
          for (const item of items) {
            docs.push(YouTubeManager.asYouTubeVideo(item));
          }
          return docs;
        }
        return [];
      });
  }

  static getLatestShowEpisodes(filters): Promise<YouTubeVideo[]> {
    const showService = new ShowService(Firestore.db);
    return showService.getItems(filters)
    .then( (items) => {
      const actions = items.map( (p: any) => YouTubeManager.getLastEpisode(p.playlistId));
      return Promise.all(actions)
      .then((videos: YouTubeVideo[]) => {
        return videos;
      });
    });
  }

  static asYouTubeVideo(data): YouTubeVideo {
    const obj = <YouTubeVideo>{
      kind: 'youtube#video',
      id: data.id,
      title: data.snippet.title,
      description: data.snippet.description,
      imageUrl: data.snippet.thumbnails.high.url,
      publishedAt: data.snippet.publishedAt,
      videoId: data.contentDetails.videoId ||data.id
    };
    return obj;
  }

}
