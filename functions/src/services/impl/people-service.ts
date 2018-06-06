const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

import { Person } from "../../models/person";
import { CoreService } from "../abstract-service";
import { IPeopleService } from "../people-service-interface";
import { FirestoreCollections } from "../../enums/firestore-collections";

export class PeopleService extends CoreService implements IPeopleService {

  constructor(db: any) {
    super(db);
  }

  async getPeople(limit: number = 10): Promise<Person[]> {

    const query: any = this.db.collection(FirestoreCollections.People);
    return query
      .orderBy('rank', 'desc')
      .limit(limit)
      .get()
      .then(snapshot => this.wrapAll<Person>(snapshot));
  }

  async getPerson(id: string): Promise<Person> {
    const query: any = this.db.collection(FirestoreCollections.People);
    return query
      .doc(id)
      .get()
      .then(snapshot => {
        return snapshot.data();
      });
  }

}
