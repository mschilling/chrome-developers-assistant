import { debug } from '../shared/debug';

import * as admin from 'firebase-admin'

import { VideoService } from './../services/video-service';
import { PeopleService } from './../services/people-service';
import { ShowService } from './../services/shows-service';
// import { EventService } from './../services/events-service';

export class DataApi {
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

  static getShows(filters) {
    debug('getShows', filters);
    const showService = new ShowService(admin.firestore());
    return showService.getItems(filters);
  }
}
