import { Event } from "../../models/event";
import { CoreService } from "../abstract-service";
import { FirestoreCollections } from "../../enums/firestore-collections";

import * as moment from 'moment';

interface IEventService {
  getNextEvent(minDateIsoString?: string): Promise<Event>;
  getPreviousEvent(maxDateIsoString?: string): Promise<Event>;
  getPreviousEventByCountry(maxDateIsoString: string, country: string): Promise<Event>;
}

export class EventService extends CoreService implements IEventService {

  constructor(db: any) {
    super(db);
  }

  async getNextEvent(minDateIsoString?: string): Promise<Event> {
    let date = moment().toDate();
    if (minDateIsoString) {
      date = moment(minDateIsoString).toDate();
    };

    const query: any = this.db.collection(FirestoreCollections.Events);
    return query
      .where('startDate', '>', date)
      .orderBy('startDate', 'asc').limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0) {
          return snapshot.docs[0].data();
        }
        return undefined;
      });

  }
  async getPreviousEvent(maxDateIsoString: string): Promise<Event> {
    let date = moment().toDate();
    if (maxDateIsoString) {
      date = moment(maxDateIsoString).toDate();
    };

    const query: any = this.db.collection(FirestoreCollections.Events);
    return query
      .where('startDate', '<', date)
      .orderBy('startDate', 'desc').limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0) {
          return snapshot.docs[0].data();
        }
        return {};
      });
  }
  async getPreviousEventByCountry(maxDateIsoString: string, country: string): Promise<Event> {
    let date = moment().toDate();
    if (maxDateIsoString) {
      date = moment(maxDateIsoString).toDate();
    };

    const query: any = this.db.collection(FirestoreCollections.Events);
    return query
      .where('country', '==', country)
      .where('startDate', '<', date)
      .orderBy('startDate', 'desc').limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0) {
          return snapshot.docs[0].data();
        }
        return {};
      });
  }

}
