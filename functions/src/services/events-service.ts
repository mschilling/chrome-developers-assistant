import { Event } from "../models/event";
import { CoreService } from "./abstract-service";
import { FirestoreCollections } from "../enums/firestore-collections";

import * as moment from 'moment';
import { GenericCard } from "../models/card";

const FALLBACK_HEADER_IMAGE = 'https://chrome-developers-assistant.firebaseapp.com/assets/google_header.jpg';
interface IEventService {
  getEvent(id: string): Promise<Event>;
  getNextEvent(filter: IEventSearchFilter): Promise<Event>;
  getPreviousEvent(maxDateIsoString?: any): Promise<Event>;
  getPreviousEventByCountry(maxDateIsoString: any, country: string): Promise<Event>;
}

interface IEventSearchFilter {
  name?: string;
  minDate?: string;
  isShowcase?: boolean;
}
export class EventService extends CoreService implements IEventService {

  constructor(db: any) {
    super(db);
  }

  async getEvent(id: string): Promise<Event> {
    console.log('getEvent ' + id);
    const query: any = this.db.collection(FirestoreCollections.Events);
    return query
      .doc(id)
      .get()
      .then(snapshot => {
        return snapshot.data();
      });
  }

  async searchEvents(filter?: IEventSearchFilter): Promise<Event[]> {
    console.log('Service searchEvents with filters ', filter);
    const { name, minDate, isShowcase } = filter;

    let date = moment().toDate();
    if (minDate) {
      date = moment(minDate).toDate();
    };

    let query: any = this.db.collection(FirestoreCollections.Events);

    if( name !== undefined) {
      query = query.where('eventKey', '==', name);
    }

    if( isShowcase === true) {
      query = query.where(`tags.showcase`, '==', true);
    }

    return query
    .limit(10)
    .get()
    .then(snapshot => this.wrapAll<Event>(snapshot));

  }

  async getNextEvent(filter?: IEventSearchFilter): Promise<Event> {
    console.log('Service getNextEvent with filters ', filter);
    const { name, minDate: minDateIsoString } = filter;

    let date = moment().toDate();
    if (minDateIsoString) {
      date = moment(minDateIsoString).toDate();
    };

    let query: any = this.db.collection(FirestoreCollections.Events);

    if( name !== undefined) {
      query = query.where('eventKey', '==', name);
    }

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
  async getPreviousEvent(maxDateIsoString: any): Promise<Event> {
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
  async getPreviousEventByCountry(maxDateIsoString: any, country: string): Promise<Event> {
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

export class EventServiceExt {
  static asCards(items: Event[]): GenericCard[] {
    if (items === null) {
      console.log("items is null");
      return [];
    }
    return items.map(p => EventServiceExt.asCard(p));
  }

  static asCard(item: Event): GenericCard {
    const card = new GenericCard();
    card._id = item.id;
    card.title = `${item.name}`;
    card.description = item.description;
    card.subTitle = `${item.venue}, ${item.location}`
    card.imageUrl = FALLBACK_HEADER_IMAGE;
    card.imageAlt = item.name;
    card.buttonUrl = item.website;
    card.buttonTitle = "Visit website";
    card._optionType = 'event#id'
    card._optionValue = card.title;

    if(item.videoId) {
      card.imageUrl = `https://img.youtube.com/vi/${item.videoId}/hq1.jpg`;
    }

    return card;
  }
}
