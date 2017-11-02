'use strict';

var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');

const admin = require('firebase-admin');
var serviceAccount = require('../firestore-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chrome-developers-assistant.firebaseio.com/'
});

const db = admin.firestore();

// spreadsheet key is the long id in the sheets URL
var doc = new GoogleSpreadsheet('1uXvW6zdf8DJdupsnmDQ0OGrfsnVd-WUX555QxtyQB-8');
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
                    first_name: row.firstname,
                    last_name: row.lastname,
                    twitter: asFbString(row.twitterhandle),
                    github: asFbString(row.githubhandle),
                    bio: asFbString(row.bio),
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
