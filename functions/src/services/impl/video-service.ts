const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

import { Video } from "../../models/video";
import { IVideoService } from "../video-service-interface";
import { CoreService } from "../abstract-service";
import { FirestoreCollections } from "../../enums/firestore-collections";

export class VideoService extends CoreService implements IVideoService {

  constructor(db: any) {
    super(db);
  }

  async search(searchParams: any, limit: number): Promise<Video[]> {
    debug('Search input params', searchParams, limit);
    if (!searchParams) {
      debug('searchParams is undefined');
      return undefined;
    };

    let query: any = this.db.collection(FirestoreCollections.Videos);

    if (searchParams.event) {
      query = query.where('eventKey', '==', searchParams.event);
    }

    if (searchParams.tags && searchParams.tags.length > 0) {
      for (const tag of searchParams.tags) {
        query = query.where(`tags.${tag || ''}`, '==', true);
      }
    }

    if (searchParams.speakers && searchParams.speakers.length > 0) {
      const speakersList = searchParams.speakers.map(p => p.trim());
      for (const speaker of speakersList) {
        query = query.where(`speakers.${speaker || ''}`, '==', true);
      }
    }

    return query
      .limit(limit)
      .get()
      .then(snapshot => this.wrapAll<Video>(snapshot));
  }

  async searchKeynoteVideos(eventName: string, year: number, limit: number): Promise<Video[]> {
    debug(`searchKeynoteVideos(${eventName}, ${year}, ${limit}) `)
    return this.db.collection(FirestoreCollections.Videos)
      .where('tags.keynote', '==', true)
      .limit(limit)
      .get()
      .then(snapshot => this.wrapAll<Video>(snapshot));
  }

  async searchEventHighlightsVideo(eventKey: string): Promise<Video[]> {
    if (!eventKey) {
      debug('eventKey is undefined');
      return undefined;
    };

    return this.db.collection(FirestoreCollections.Videos)
      .where('eventKey', '==', eventKey)
      .where('tags.highlights', '==', true)
      .limit(1)
      .get()
      .then(snapshot => this.wrapAll<Video>(snapshot));
  }

  async filterVideosBySpeakers(speakers: any, limit: number): Promise<Video[]> {
    if ((speakers || []).length === 0) {
      debug('speakers is undefined');
      return undefined;
    };

    debug(speakers);

    const speakersList = speakers.map(p => p.trim());

    let promise: any = this.db.collection(FirestoreCollections.Videos);

    for (const speaker of speakersList) {
      promise = promise.where(`speakers.${speaker}`, '==', true);
    }

    return promise
      .limit(limit)
      .get()
      .then(snapshot => this.wrapAll<Video>(snapshot));

  }

}
