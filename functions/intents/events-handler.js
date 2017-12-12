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
        assistant.ask(speech);
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
        assistant.ask(speech);
      } else {
        assistant.ask(Str.EVENTS.NO_RESULT);
      }
    });
}

module.exports = {
  previousEvent: previousEventHandler,
  nextEvent: nextEventHandler
};
