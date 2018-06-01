import * as admin from 'firebase-admin';
import { FirestoreCollections } from '../enums/firestore-collections';

const db = admin.firestore();
const videosRef = db.collection(FirestoreCollections.Videos);

export class VideosRepository {

  static Search(searchParams, limit = 10) {
    if (!searchParams) {
      debug('searchParams is undefined');
      return undefined;
    };

    let query: any = videosRef;

    if (searchParams.event) {
      query = query.where('eventKey', '==', searchParams.event);
    }

    if (searchParams.tags && searchParams.tags.length > 0) {
      for (const tag of  searchParams.tags) {
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

  static searchKeynoteVideos(eventName, year, limit = 3) {
    console.log(`searchKeynoteVideos(${eventName}, ${year}, ${limit}) `)
    return videosRef
      .where('isKeynote', '==', true)
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

  static searchEventHighlightsVideo(eventKey) {
    if (!eventKey) {
      debug('eventKey is undefined');
      return undefined;
    };

    return videosRef
      .where('eventKey', '==', eventKey)
      .where('tags.highlights', '==', true)
      .limit(1)
      .get()
      .then(snapshot => {
        debug('videosRef snapshot result', snapshot.docs);
        if (snapshot.docs.length > 0) {
          return snapshot.docs[0].data();
        }
        debug('no results found');
        return undefined;
      });
  }

  static filterVideosBySpeakers(speakers, limit = 3) {
    if ((speakers || []).length === 0) {
      debug('speakers is undefined');
      return undefined;
    };

    debug(speakers);

    const speakersList = speakers.map(p => p.trim());

    let promise: any = videosRef;

    for (const speaker of speakersList) {
      promise = promise.where(`speakers.${speaker}`, '==', true);
    }

    return promise
      // .orderBy('dateAdded', 'asc')
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

}
