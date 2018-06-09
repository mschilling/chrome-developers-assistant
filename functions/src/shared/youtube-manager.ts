import { ShowService } from './../services/shows-service';
require('dotenv').config({silent: true});

import { debug } from './debug';

import * as functions from 'firebase-functions';
import { Firestore } from './firestore';

const axios = require('axios');
// const api = require('../helpers/api');

const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const ACCESS_TOKEN = process.env.YOUTUBE_KEY || functions.config().youtube.key;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  // headers: {'Authorization': 'Bearer ' + ACCESS_TOKEN}
});

class OpenGraphObject {
  static asYouTubeVideo(data) {
    const obj = {
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

export class YouTubeManager {

  static getVideoById(videoId) {
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
          // console.log(items[0]);
          return OpenGraphObject.asYouTubeVideo(items[0]);
        }
        return null;
      });
  }

  static getLastEpisode(playlistId) {
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
          // console.log(items[0]);
          return OpenGraphObject.asYouTubeVideo(items[0]);
        }
        return null;
      });
  }

  static getPlaylistVideos(playlistId) {
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
          // console.log(items[0]);
          const docs = [];
          for (const item of items) {
            docs.push(OpenGraphObject.asYouTubeVideo(item));
          }
          return docs;
        }
        return [];
      });
  }

  static getLatestShowEpisodes(filters) {
    const showService = new ShowService(Firestore.db);
    return showService.getItems(filters)
    .then( (items) => {
      const actions = items.map( (p: any) => YouTubeManager.getLastEpisode(p.playlistId));
      return Promise.all(actions)
      .then((videos) => {
        return videos;
      });
    });
  }
}
