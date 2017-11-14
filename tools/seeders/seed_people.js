'use strict';

require('dotenv').config({ silent: true });

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

const admin = require('firebase-admin');
var serviceAccount = require('../firestore-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.firestore();

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
            console.log(info);
            console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
            sheet = info.worksheets[0];
            // console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
            step();
        });
    },

    function writeDataToFirebase(step) {
        sheet.getRows({
            offset: 1,
            limit: 50,
            orderby: 'col2'
        }, function (err, rows) {
            console.log('Read ' + rows.length + ' rows');

            var dataToImport = {};
            var tasks = [];
            for (let i = 0; i < rows.length; i++) {
                // console.log(rows[i]);

                let row = rows[i];
                let docId = rows[i].id;

                let obj = {
                    id: docId,
                    first_name: row.firstname,
                    last_name: row.lastname,
                    twitter: asFbString(row.twitterhandle),
                    github: asFbString(row.githubhandle),
                    lanyrd: asFbString(row.lanyrdhandle),
                    bio: asFbString(row.bio),
                    short_bio: asFbString(row.shortbio),
                    email: asFbString(row.email),
                    pictureUrl: asFbString(row.pictureurl),
                    homepage: asFbString(row.homepage),
                    is_speaker: asFbBool(row.isspeaker)
                };

                db.collection('people').doc(docId).set(obj, { merge: true})

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
    if(!input) return null;
    return input;
}
