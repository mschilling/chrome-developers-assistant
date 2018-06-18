import { debug } from '../shared/debug';

import { Video } from "../models/video";
import { CoreService } from "./abstract-service";
import { FirestoreCollections } from "../enums/firestore-collections";
import { GenericCard } from '../models/card';

interface IVideoService {
  search(searchParams, limit: number): Promise<Video[]>;
  searchKeynoteVideos(eventName: string, year: number, limit: number): Promise<Video[]>;
  searchEventHighlightsVideo(eventKey: string): Promise<Video[]>;
  filterVideosBySpeakers(speakers, limit: number): Promise<Video[]>;
}

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

export class VideoServiceExt {
  static asCards(items: Video[]): GenericCard[] {
    if (items === null) {
      console.log("items is null");
      return [];
    }
    return items.map(p => VideoServiceExt.asCard(p));
  }

  static asCard(item: Video): GenericCard {
    const thumbId = String(Math.ceil(Math.random() * 3));

    const card = new GenericCard();
    card._id = item.id;
    card.title = item.name;
    card.description = item.description;
    card.imageUrl = `https://img.youtube.com/vi/${item.videoId}/hq${thumbId}.jpg`;
    card.imageAlt = card.title;
    card.buttonUrl = 'https://youtube.com/watch?v=' + item.videoId;
    card.buttonTitle = 'Watch on YouTube';
    card._optionType = 'youtube#video'
    card._optionValue = item.videoId;
    return card;
  }
}
