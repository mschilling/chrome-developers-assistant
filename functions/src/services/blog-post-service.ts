import * as moment from "moment";
import { BlogPost } from "../models/blog-post";
import { CoreService } from "./abstract-service";
import { FirestoreCollections } from "../enums/firestore-collections";
import { debug } from '../shared/debug';
import { GenericCard } from "../models/card";

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

    console.log(`[BLOGS] [params=${JSON.stringify(searchParams)}]`)

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

export class BlogPostServiceExt {
  static asCards(items: BlogPost[]): GenericCard[] {
    if (items === null) {
      console.log("items is null");
      return [];
    }
    return items.map(p => BlogPostServiceExt.asCard(p));
  }

  static asCard(item: BlogPost): GenericCard {
    const card = new GenericCard();
    card._id = item.id;
    card.title = item.title;
    card.description = `Published ${moment(item.publishDate).fromNow()} by ${item.author}`;
    card.imageUrl = item.postImageUrl;
    card.imageAlt = card.title;
    card.buttonUrl = item.postUrl;
    card.buttonTitle = "Read more";
    card._optionType = 'blogpost#id'
    card._optionValue = card.title;
    return card;
  }
}
