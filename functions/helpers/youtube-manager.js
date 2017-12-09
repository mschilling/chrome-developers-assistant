'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

const functions = require('firebase-functions');
// const admin = require('firebase-admin');

const axios = require('axios');

const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const ACCESS_TOKEN = functions.config().youtube.key;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
  // headers: {'Authorization': 'Bearer ' + ACCESS_TOKEN}
});

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);

class YouTubeManager {

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
          console.log(items[0]);
          return OpenGraphObject.asYouTubeVideo(items[0]);
        }
        return;
      });
  }
}

class OpenGraphObject {
  static asYouTubeVideo(data) {
    const obj = {
      kind: 'youtube#video',
      id: data.id,
      title: data.snippet.title,
      description: data.snippet.description,
      imageUrl: data.snippet.thumbnails.high.url,
      publishedAt: data.snippet.publishedAt,
      videoId: data.contentDetails.videoId
    };
    return obj;
  }
}

module.exports = YouTubeManager;
