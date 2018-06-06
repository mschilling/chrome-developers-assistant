'use strict';

const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

import * as admin from 'firebase-admin'

import { VideoService } from '../../services/impl/video-service';
import { PeopleService } from '../../services/impl/people-service';
import { BlogPostService } from '../../services/impl/blog-post-service';
import { ShowService } from '../../services/impl/shows-service';
import { EventService } from '../../services/impl/events-service';

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);

class AssistantDataApi {
  static getPerson(id) {
    debug('getPerson', id);
    const peopleService = new PeopleService(admin.firestore());
    return peopleService.getPerson(id);
  }

  static getPeople(limit = 10) {
    debug('getPeople', limit);
    const peopleService = new PeopleService(admin.firestore());
    return peopleService.getPeople(limit);
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
    const videoService = new VideoService(admin.firestore());
    return videoService.searchKeynoteVideos(event, year, limit);
  }

  static getNextEvent(timestamp) {
    debug('getNextEvent', timestamp);
    const eventService = new EventService(admin.firestore());
    return eventService.getNextEvent(timestamp);
  }

  static getPreviousEvent(timestamp) {
    debug('getPreviousEvent', timestamp);
    const eventService = new EventService(admin.firestore());
    return eventService.getPreviousEvent(timestamp);
  }

  static getPreviousEventByCountry(timestamp, country) {
    debug('getPreviousEventByCountry', timestamp, country);
    const eventService = new EventService(admin.firestore());
    return eventService.getPreviousEventByCountry(timestamp, country);
  }

  static searchVideos(searchParams, limit) {
    debug('searchVideos', searchParams, limit);
    const videoService = new VideoService(admin.firestore());
    return videoService.search(searchParams, limit);
  }

  static searchEventHighlightsVideo(eventKey) {
    debug('searchEventHighlightsVideo', eventKey);
    const videoService = new VideoService(admin.firestore());
    return videoService.searchEventHighlightsVideo(eventKey);
  }

  static filterVideosBySpeakers(speakers, limit) {
    debug('filterVideosBySpeakers', speakers, limit);
    const videoService = new VideoService(admin.firestore());
    return videoService.filterVideosBySpeakers(speakers, limit);
  }

  static searchBlogPosts(searchParams, limit) {
    debug('searchBlogPosts', searchParams, limit);
    const blogPostService = new BlogPostService(admin.firestore());
    return blogPostService.search(searchParams, limit);
  }

  static getBlogPostById(key) {
    debug('getBlogPostById', key);
    const blogPostService = new BlogPostService(admin.firestore());
    return blogPostService.getByKey(key);
  }

  static getShows(filters) {
    debug('getShows', filters);
    const showService = new ShowService(admin.firestore());
    return showService.getItems(filters);
  }
}

module.exports = AssistantDataApi;
