'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

// const moment = require('moment');
const apiVideos = require('./videos');
const apiEvents = require('./events');
const apiPeople = require('./people');

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);

class AssistantDataApi {
  static getPerson(id) {
    debug('getPerson', id);
    return apiPeople.getPerson(id);
  }

  static getPeople(limit = 5) {
    debug('getPeople', limit);
    return apiPeople.getPeople(limit);
  }

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

  static getPreviousEvent(timestamp) {
    debug('getPreviousEvent', timestamp);
    return apiEvents.getPreviousEvent(timestamp);
  }

  static getPreviousEventByCountry(timestamp, country) {
    debug('getPreviousEventByCountry', timestamp, country);
    return apiEvents.getPreviousEventByCountry(timestamp, country);
  }

  static searchVideos(searchParams, limit) {
    debug('searchVideos', searchParams, limit);
    return apiVideos.search(searchParams, limit);
  }

  static searchEventHighlightsVideo(eventKey) {
    debug('searchEventHighlightsVideo', eventKey);
    return apiVideos.searchEventHighlightsVideo(eventKey);
  }

  static filterVideosBySpeakers(speakers, limit) {
    debug('filterVideosBySpeakers', speakers, limit);
    return apiVideos.filterVideosBySpeakers(speakers, limit);
  }
}

module.exports = AssistantDataApi;
