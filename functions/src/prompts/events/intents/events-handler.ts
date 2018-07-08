import * as moment from 'moment';
import { BasicCard, Button, Image, SimpleResponse } from "actions-on-google";
import { Firestore } from '../../../shared/firestore';
import { EventService, EventServiceExt } from '../../../services/events-service';
import { buildSimpleCard } from '../../../utils/responses';
import { Event } from '../../../models/event';

const eventService = new EventService(Firestore.db);

const SEARCH_DATE_FORMAT = 'YYYY-MM-DD';
const SEARCH_DATE_PARAM = 'search-date';
const FILTER_COUNTRY_PARAM = 'country';


export async function previousEvent(conv, params) {
  let inputDate = new Date();

  const searchDate = params[SEARCH_DATE_PARAM];
  let filterCountry = params[FILTER_COUNTRY_PARAM];

  console.log(searchDate, filterCountry);

  if (searchDate) {
    inputDate = moment(searchDate, SEARCH_DATE_FORMAT).toDate();
  }

  if (filterCountry) {
    filterCountry = filterCountry.toLowerCase();
  }

  let event: Event;
  if (filterCountry) {
    event = await eventService.getPreviousEventByCountry(inputDate, filterCountry);
  } else {
    event = await eventService.getPreviousEvent(inputDate);
  }

  if (event && event.name) {
    const speech = `<speak>
            The last event was ${event.name} in ${event.location}.<break time="1"/>
            Anything else?
            </speak>`;


    conv.ask(speech);
    conv.ask(buildSimpleCard(EventServiceExt.asCard(event)));

  } else {
    conv.ask('Sorry, I couldn\'t find any event right now');
  }
}

export async function nextEvent(conv, params) {
  let inputDate = new Date();

  const searchDate = params[SEARCH_DATE_PARAM];
  if (searchDate) {
    inputDate = moment(searchDate, SEARCH_DATE_FORMAT).toDate();
  }

  const { event: filterEvent } = params;

  const filter: any = {};
  if(filterEvent) {
    filter.name = filterEvent;
  }
  filter.minDate = inputDate;

  const event: Event = await eventService.getNextEvent(filter);

  if (event && event.name) {

    const response = {
      speech: `
        <speak>The next event is ${event.name}.<break time="1"/>.
        It will take place on ${moment(event.startDate).format('dddd, MMMM Do')} in ${event.location}.
        Anything Else?</speak>`,
      text: `Checkout these event details`
    }

    if(filterEvent) {
      response.speech = `
        <speak>The next ${event.name} will take place on ${moment(event.startDate).format('dddd, MMMM Do')}.
        <break time="1"/> Anything Else?</speak>`;
    }

    conv.ask(new SimpleResponse(response));
    conv.ask(buildSimpleCard(EventServiceExt.asCard(event)))
  } else {
    conv.ask('Sorry, I couldn\'t find any. Anything else?');
  }
}
