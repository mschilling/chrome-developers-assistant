'use strict';

require('dotenv').config({ silent: true });

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

const moment = require('moment');
const admin = require('firebase-admin');
var serviceAccount = require('../firestore-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.firestore();

const INPUT_DATE_FORMAT = "D-M-YYYY";

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet(process.env.SOURCE_DOC_ID);
var sheet;

async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    var creds = require('../service-account.json');
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function (err, info) {
      // console.log(info);
      console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
      sheet = info.worksheets[2];
      // console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
      // console.log(info.worksheets);
      step();
    });
  },

  function writeDataToFirebase(step) {
    sheet.getRows({
      offset: 1,
      limit: 20,
      orderby: 'col2'
    }, function (err, rows) {
      console.log('Read ' + rows.length + ' rows');

      var dataToImport = {};
      var tasks = [];
      for (let i = 0; i < rows.length; i++) {
        // console.log(rows[i]);

        let row = rows[i];
        let docId = asFbString(row.id);

        let obj = {
          videoId: asFbString(row.videoid),
          name: asFbString(row.name),
          dateAdded: asFbDate(row.dateadded),
          description: asFbString(row.description),
          eventId: asFbString(row.eventid),
          eventKey: asFbString(row.eventkey),
          speakers: asFbArrayAsObjectKeys(row.featuredspeakers),
          tags: asFbArrayAsObjectKeys(row.tags),
          isKeynote: asFbBool(row.iskeynote)
        };

        // console.log(obj)
        db.collection('videos').doc(docId).set(obj, { merge: true })

      };

      step();

    });
  }

], function (err) {
  if (err) {
    console.log('Error: ' + err);
  }
});

function asFbBool(input) {
  return ((input || '').toLowerCase() === 'true');
}

function asFbString(input) {
  if (!input) return null;
  return input;
}

function asFbStringArray(input) {
  if (!input) return [];
  return input.split(',').map(p => (p + '').trim());
}

function asFbNumber(input) {
  if (!input) return null;
  let output = parseInt(input);
  return output;
}

function asFbDateIsoString(input) {
  if (!input) return null;
  let date = moment(input, INPUT_DATE_FORMAT);
  return date.utc(true).toISOString();
}

function asFbDate(input) {
  if (!input) return null;
  let date = moment(input, INPUT_DATE_FORMAT);
  return date.utc(true).toDate();
}

function asFbArrayAsObjectKeys(input) {
  if (!input) return null;
  const props = input.split(',').reduce(function(acc, cur, i) {
    acc[cur] = true;
    return acc;
  }, {});
  return props;
}
