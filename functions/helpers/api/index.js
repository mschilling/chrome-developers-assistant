'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

// const moment = require('moment');
const apiVideos = require('./videos');
const apiEvents = require('./events');

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);

class AssistantDataApi {
  static getKeynoteVideo(event, year) {
    debug('getKeynoteVideo', event, year);
    return this.getKeynoteVideos(event, year, 1)
      .then(results => {
        if ( (results || []).length > 0) {
          return results[0];
        }
        return undefined;
      });
  }

  static getKeynoteVideos(event, year, limit = 3) {
    debug('getKeynoteVideos', event, year, limit);
    return apiVideos.searchKeynoteVideos(event, year, limit);
  }

  static getNextEvent(timestamp) {
    debug('getNextEvent', timestamp);
    return apiEvents.getNextEvent(timestamp);
  }
}

module.exports = AssistantDataApi;
