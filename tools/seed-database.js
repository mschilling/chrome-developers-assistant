'use strict';

require('dotenv').config({silent: true});

process.env.DEBUG = 'cda-db-seeder:*';

const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet(process.env.SOURCE_DOC_ID);

const serviceAccount = require('./creds-firestore.json');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const dbHelper = require('./helpers/db-seeder');

let sheet;
let worksheets;

async.series([

  function setAuth(step) {
    const creds = require('./creds-drive.json');
    doc.useServiceAccountAuth(creds, step);
  },

  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      worksheets = info.worksheets;
      step();
    });
  },

  function seedPeople(step) {
    const dataSheet = getSheetByName(worksheets, 'people');
    dataSheet.getRows({
      offset: 1
    }, function(err, rows) {
      dbHelper.seedPeople(rows).then(() => {
        step();
      });
    });
  },

  function seedEvents(step) {
    const dataSheet = getSheetByName(worksheets, 'events');
    dataSheet.getRows({
      offset: 1,
    }, function(err, rows) {
      dbHelper.seedEvents(rows).then(() => {
        step();
      });
    });
  },

  function seedVideos(step) {
    const dataSheet = getSheetByName(worksheets, 'videos');
    dataSheet.getRows({
      offset: 1,
    }, function(err, rows) {
      dbHelper.seedVideos(rows).then(() => {
        step();
      });
    });
  },

], function(err) {
  if (err) {
    console.log('Error: ' + err);
  }
});

function getSheetByName(sheets, name) {
  for (sheet of sheets) {
    if (sheet.title == name) return sheet;
  }
  return;
}
