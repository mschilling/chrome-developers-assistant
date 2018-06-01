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

  async Search(searchParams: any, limit: number): Promise<Video[]> {
    debug('Search', searchParams);
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
      .then(snapshot => {
        const docs = [];
        for (const doc of snapshot.docs) {
          docs.push(doc.data());
        }
        return docs;
      });
  }

  searchKeynoteVideos(eventName: string, year: number, limit: number): Promise<Video[]> {
    throw new Error("Method not implemented.");
  }

  searchEventHighlightsVideo(eventKey: string): Promise<Video[]> {
    throw new Error("Method not implemented.");
  }

  filterVideosBySpeakers(speakers: any, limit: number): Promise<Video[]> {
    throw new Error("Method not implemented.");
  }

}
