'use strict';

const Debug = require('debug');
const debug = Debug('bite-api:debug');
const error = Debug('bite-api:error');

const moment = require('moment');
const admin = require('firebase-admin');
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

module.exports = {
  getNextEvent: getNextEvent
};
