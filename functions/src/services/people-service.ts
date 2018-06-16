import { Person } from "../models/person";
import { CoreService } from "./abstract-service";
import { FirestoreCollections } from "../enums/firestore-collections";

export interface IPeopleService {
  getPeople(limit?: number): Promise<Person[]>;
  getPerson(id: string): Promise<Person>;
}

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
    console.log('getPerson ' + id);
    const query: any = this.db.collection(FirestoreCollections.People);
    return query
      .doc(id)
      .get()
      .then(snapshot => {
        return snapshot.data();
      });
  }

}
