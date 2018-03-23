'use strict';

import * as admin from 'firebase-admin';

// const Debug = require('debug');
// const debug = Debug('google-developer-assistant-api:debug');
// const error = Debug('google-developer-assistant-api:error');

const peopleRef = admin.firestore().collection('people');

export class PeopleRepository {

  static GetPeople(limit = 10) {
    return peopleRef
      .orderBy('rank', 'desc')
      .limit(limit)
      .get()
      .then(snapshot => {
        const docs = [];
        for (const doc of snapshot.docs) {
          docs.push(doc.data());
        }
        return docs;
      });
  }

  static GetPerson(id) {
    return peopleRef
      .doc(id)
      .get()
      .then(snapshot => {
        return snapshot.data();
      });
  }
}
