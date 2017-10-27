'use strict';

const moment = require('moment');
const admin = require('firebase-admin');
const eventsRef = admin.firestore().collection('events');

// Context Parameters
const SEARCH_DATE_PARAM = 'search-date';

function previousEventHandler(assistant) {

    let inputDate = (new Date()).toISOString();
    const searchDate = assistant.getArgument(SEARCH_DATE_PARAM);
    if(searchDate) {
        inputDate = moment(searchDate, "YYYY-MM-DD").toISOString();
    }

    GetPreviousEvent(inputDate)
        .then( event => {
        if (event) {
            const speech = `<speak>
                The next event was ${event.name} in ${event.location}<break time="2"/>
                Anything else?
                </speak>`;
            assistant.ask(speech);
        } else {
            const speech = 'Sorry, I couldn\'t find any event right now';
            assistant.ask(speech);
        }
    })
}

function GetPreviousEvent(dateString) {
     return eventsRef
        .where('startDate', '<', dateString)
        .orderBy('startDate', 'desc').limit(1)
        .get()
        .then(snapshot => {
            if(snapshot.docs.length > 0) {
                return snapshot.docs[0].data();
            }
            return {};
        });
}

module.exports = {
  previousEvent: previousEventHandler
};
