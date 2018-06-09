import { BlogPost } from "../models/blog-post";
import { CoreService } from "./abstract-service";
import { FirestoreCollections } from "../enums/firestore-collections";
import { debug } from '../shared/debug';

interface IBlogPostService {
  search(searchParams: any, limit?: number): Promise<BlogPost[]>;
  getByKey(key: string): Promise<BlogPost>;
}

export class BlogPostService extends CoreService implements IBlogPostService {

  constructor(db: any) {
    super(db);
  }

  async search(searchParams: any, limit: number = 10): Promise<BlogPost[]> {
    if (!searchParams) {
      debug('searchParams is undefined');
      return undefined;
    };

    let query: any = this.db.collection(FirestoreCollections.BlogPosts);

    if (searchParams.person) {
      query = query.where(`authors.${searchParams.person}`, '==', true);
    }

    if (!searchParams.person) {
      query = query.orderBy('publishDate', 'desc');
    }

    return query
      .limit(limit)
      .get()
      .then(snapshot => this.wrapAll<BlogPost>(snapshot));
  }
  async getByKey(key: string): Promise<BlogPost> {
    if (!key) {
      // debug('key is undefined');
      return null;
    };

    const query: any = this.db.collection(FirestoreCollections.BlogPosts);
    return query
      .doc(key)
      .get()
      .then(snapshot => snapshot.data());
  }

}
