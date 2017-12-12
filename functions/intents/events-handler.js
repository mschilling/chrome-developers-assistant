'use strict';

const moment = require('moment');
const api = require('../helpers/api');
const Str = require('../strings');

const SEARCH_DATE_FORMAT = 'YYYY-MM-DD';

// Context Parameters
const SEARCH_DATE_PARAM = 'search-date';
const FILTER_COUNTRY_PARAM = 'country';

function previousEventHandler(assistant) {
  let inputDate = new Date();
  const searchDate = assistant.getArgument(SEARCH_DATE_PARAM);
  if (searchDate) {
      inputDate = moment(searchDate, SEARCH_DATE_FORMAT).toDate();
  }

  let filterCountry = assistant.getArgument(FILTER_COUNTRY_PARAM);
  if (filterCountry) {
    filterCountry = filterCountry.toLowerCase();
  }

  let getEventPromise;
  if (filterCountry) {
    getEventPromise = api.getPreviousEventByCountry(inputDate, filterCountry);
  } else {
    getEventPromise = api.getPreviousEvent(inputDate);
  }

  getEventPromise.then( event => {
    if (event) {
        const speech = `<speak>
            The last event was ${event.name} in ${event.location}.<break time="1"/>
            Anything else?
            </speak>`;

            event.imageUrl = `https://img.youtube.com/vi/${event.videoId}/hq1.jpg`;

            const response = assistant.buildRichResponse().addSimpleResponse(speech);
            const basicCard = buildBasicCard(assistant, event);
            response.addBasicCard(basicCard);
            assistant.ask(response);
    } else {
        assistant.ask(Str.EVENTS.NO_RESULT);
    }
  });
}

function nextEventHandler(assistant) {
  let inputDate = new Date();
  const searchDate = assistant.getArgument(SEARCH_DATE_PARAM);
  if (searchDate) {
    inputDate = moment(searchDate, SEARCH_DATE_FORMAT).toDate();
  }

  api.getNextEvent(inputDate)
    .then(event => {
      if (event) {
        const speech = `<speak>
              The next event is ${event.name}.<break time="1"/>
              Anything else?
              </speak>`;
              event.imageUrl = `https://img.youtube.com/vi/${event.videoId}/hq1.jpg`;

              const response = assistant.buildRichResponse().addSimpleResponse(speech);
              const basicCard = buildBasicCard(assistant, event);
              response.addBasicCard(basicCard);
              assistant.ask(response);
      } else {
        assistant.ask(Str.EVENTS.NO_RESULT);
      }
    });
}

function buildBasicCard(assistant, cardData) {
  console.log('buildBasicCard', cardData);
  return assistant.buildBasicCard(cardData.description)
    .setTitle(cardData.name)
    .setSubtitle(`${cardData.venue}, ${cardData.location}`)
    .addButton('Visite website', cardData.website)
    .setImage(cardData.imageUrl, cardData.name)
    .setImageDisplay('CROPPED')
    ;
}


module.exports = {
  previousEvent: previousEventHandler,
  nextEvent: nextEventHandler
};
