'use strict';

import * as admin from 'firebase-admin';

const moment = require('moment');
const eventsRef = admin.firestore().collection('events');

function getNextEvent(minDateIsoString) {
  let date = moment().toDate();
  if (minDateIsoString) {
    date = moment(minDateIsoString).toDate();
  };

  return eventsRef
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

function getPreviousEvent(maxDateIsoString) {
  let date = moment().toDate();
  if (maxDateIsoString) {
    date = moment(maxDateIsoString).toDate();
  };

  return eventsRef
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

  function getPreviousEventByCountry(maxDateIsoString, country) {
  let date = moment().toDate();
  if (maxDateIsoString) {
    date = moment(maxDateIsoString).toDate();
  };

  return eventsRef
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

module.exports = {
  getNextEvent: getNextEvent,
  getPreviousEvent: getPreviousEvent,
  getPreviousEventByCountry: getPreviousEventByCountry
};
