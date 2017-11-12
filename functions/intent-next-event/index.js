'use strict';

const moment = require('moment');
const api = require('../helpers/api');

// Context Parameters
const SEARCH_DATE_PARAM = 'search-date';

function nextEventHandler(assistant) {
  let inputDate = new Date();
  const searchDate = assistant.getArgument(SEARCH_DATE_PARAM);
  if (searchDate) {
    inputDate = moment(searchDate, 'YYYY-MM-DD').toDate();
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
        const speech = 'Sorry, I couldn\'t find any event right now';
        assistant.ask(speech);
      }
    });
}

module.exports = {
  nextEvent: nextEventHandler
};
