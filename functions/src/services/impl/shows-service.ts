import { Show } from "../../models/show";

import { CoreService } from "../abstract-service";
import { FirestoreCollections } from "../../enums/firestore-collections";
import { IShowService } from "../shows-service-interface";

export class ShowService extends CoreService implements IShowService {

  constructor(db: any) {
    super(db);
  }

  getItems(inputFilters: any = {}): Promise<Show[]> {
    const filters = inputFilters || {};

    const limit = filters.limit || 3;

    const query: any = this.db.collection(FirestoreCollections.Shows);
    return query
      // .where('isKeynote', '==', true)
      .limit(limit)
      .get()
      .then(snapshot => this.wrapAll<Show>(snapshot));
  }
}
