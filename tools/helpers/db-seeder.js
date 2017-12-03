'use strict';

const Debug = require('debug');
const debug = Debug('cda-db-seeder:debug');
const error = Debug('cda-db-seeder:error');

const moment = require('moment');
const admin = require('firebase-admin');
const db = admin.firestore();

const INPUT_DATE_FORMAT = 'D-M-YYYY';

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);

class DbLoader {
  // Static Helper Functions

  static seedPeople(rows) {
    debug('seedPeople', rows.length);
    const dbRef = db.collection('people');

    const actions = [];
    for (const row of rows) {
      const docId = asFbString(row.id);
      const obj = {
        id: docId,
        first_name: row.firstname,
        last_name: row.lastname,
        twitter: asFbString(row.twitterhandle),
        github: asFbString(row.githubhandle),
        lanyrd: asFbString(row.lanyrdhandle),
        speaker_deck: asFbString(row.speakerdeck),
        bio: asFbString(row.bio),
        short_bio: asFbString(row.shortbio),
        email: asFbString(row.email),
        pictureUrl: asFbString(row.pictureurl),
        homepage: asFbString(row.homepage),
        is_speaker: asFbBool(row.isspeaker)
      };
      actions.push(dbRef.doc(docId).set(obj, { merge: true }));
    };
    return Promise.all(actions);
  }

  static seedEvents(rows) {
    debug('seedEvents', rows.length);
    const dbRef = db.collection('events');

    const actions = [];
    for (const row of rows) {
      const docId = asFbString(row.id);
      const obj = {
        id: docId,
        eventKey: asFbString(row.eventkey),
        name: asFbString(row.name),
        description: asFbString(row.description),
        country: asFbString(row.country),
        location: asFbString(row.location),
        venue: asFbString(row.venue),
        website: asFbString(row.website),
        startDate: asFbDate(row.startdate),
        endDate: asFbDate(row.enddate),
        numberOfDays: asFbNumber(row.numberofdays),
      };
      actions.push(dbRef.doc(docId).set(obj, { merge: true }));
    };
    return Promise.all(actions);
  }

  static seedVideos(rows) {
    debug('seedVideos', rows.length);
    const dbRef = db.collection('videos');

    const actions = [];
    for (const row of rows) {
      const docId = asFbString(row.id);
      const obj = {
        id: docId,
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
      actions.push(dbRef.doc(docId).set(obj, { merge: true }));
    };
    return Promise.all(actions);
  }

  static seedBlogPosts(rows) {
    debug('seedBlogPosts', rows.length);
    const dbRef = db.collection('blogposts');

    const actions = [];
    for (const row of rows) {
      const docId = asFbString(row.id);
      const obj = {
        id: docId,
        // videoId: asFbString(row.videoid),
        title: asFbString(row.title),
        publishDate: asFbDate(row.publishdate),
        authors: asFbArrayAsObjectKeys(row.authors),
        postUrl: asFbString(row.posturl),
        tags: asFbArrayAsObjectKeys(row.tags)
      };
      actions.push(dbRef.doc(docId).set(obj, { merge: true }));
    };
    return Promise.all(actions);
  }
}

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
  const props = input.split(',').map(p => (p + '').trim()).reduce(function (acc, cur, i) {
    acc[cur] = true;
    return acc;
  }, {});
  return props;
}

module.exports = DbLoader;
