import * as moment from 'moment';
import { BasicCard, Button, Image, SimpleResponse } from "actions-on-google";
import { Firestore } from '../../../shared/firestore';
import { EventService } from '../../../services/events-service';

const eventService = new EventService(Firestore.db);

const SEARCH_DATE_FORMAT = 'YYYY-MM-DD';
const SEARCH_DATE_PARAM = 'search-date';
const FILTER_COUNTRY_PARAM = 'country';

const FALLBACK_HEADER_IMAGE = 'https://chrome-developers-assistant.firebaseapp.com/assets/google_header.jpg';

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

  let event;
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

    event.imageUrl = `https://img.youtube.com/vi/${event.videoId}/hq1.jpg`;

    conv.ask(speech);
    conv.ask(buildBasicCard(event));

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

  const event: any = await eventService.getNextEvent(filter);

  if (event && event.name) {
    if(event.videoId) {
      event.imageUrl = `https://img.youtube.com/vi/${event.videoId}/hq1.jpg`;
    } else {
      event.imageUrl = FALLBACK_HEADER_IMAGE;
    }

    const response = {
      speech: `
        <speak>The next event is ${event.name}.<break time="1"/>.
        It will take place on ${moment(event.startDate).format('dddd, MMMM Do')} in ${event.location}
        Anything Else?</speak>`,
      text: `Checkout these event details`
    }

    if(filterEvent) {
      response.speech = `
        <speak>The next ${event.name} will take place on ${moment(event.startDate).format('dddd, MMMM Do')}.
        <break time="1"/> Anything Else?</speak>`;
    }


    conv.ask(new SimpleResponse(response));
    conv.ask(buildBasicCard(event));
  } else {
    conv.ask('Sorry, I couldn\'t find any. Anything else?');
  }
}

function buildBasicCard(cardData): BasicCard {
  console.log('buildBasicCard', cardData);
  return new BasicCard({
    text: cardData.description,
    title: cardData.name,
    subtitle: `${cardData.venue}, ${cardData.location}`,
    buttons: new Button({
      title: 'Visit website',
      url: cardData.website
    }),
    image: new Image({
      url: cardData.imageUrl,
      alt: cardData.name
    }),
    display: 'CROPPED'
  })
}
