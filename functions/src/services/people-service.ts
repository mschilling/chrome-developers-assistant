import { Person } from "../models/person";
import { CoreService } from "./abstract-service";
import { FirestoreCollections } from "../enums/firestore-collections";
import { GenericCard } from "../models/card";

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

export class PeopleServiceExt {
  static asCards(items: Person[]): GenericCard[] {
    if (items === null) {
      console.log("items is null");
      return [];
    }
    return items.map(p => PeopleServiceExt.asCard(p));
  }

  static asCard(item: Person): GenericCard {
    const card = new GenericCard();
    card._id = item.id;
    card.title = `${item.first_name} ${item.last_name}`;
    card.description = item.short_bio || item.bio || "n.a.";
    card.imageUrl = item.pictureUrl || "http://lorempixel.com/200/400";
    card.imageAlt = card.title;
    card.buttonUrl = item.homepage;
    card.buttonTitle = "Visit homepage";
    card._optionType = 'person#name'
    card._optionValue = card.title;

    return card;
  }
}
