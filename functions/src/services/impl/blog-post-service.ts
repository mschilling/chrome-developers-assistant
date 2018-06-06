const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

import { BlogPost } from "../../models/blog-post";
import { IPeopleService } from "../blog-post-service-interface";
import { CoreService } from "../abstract-service";
import { FirestoreCollections } from "../../enums/firestore-collections";

export class PeopleService extends CoreService implements IPeopleService {

  constructor(db: any) {
    super(db);
  }

  async search(searchParams: any, limit?: number): Promise<BlogPost[]> {
    if (!searchParams) {
      debug('searchParams is undefined');
      return undefined;
    };

    let query: any = this.db.collection(FirestoreCollections.People);

    if (searchParams.person) {
      query = query.where(`authors.${searchParams.person}`, '==', true);
    }

    if (!searchParams.person) {
      query = query.orderBy('publishDate', 'desc');
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
  async getByKey(key: string): Promise<BlogPost> {
    if (!key) {
      // debug('key is undefined');
      return null;
    };

    const query: any = this.db.collection(FirestoreCollections.People);
    return query
      .doc(key)
      .get()
      .then(snapshot => {
        return snapshot.data();
      });
  }

}
