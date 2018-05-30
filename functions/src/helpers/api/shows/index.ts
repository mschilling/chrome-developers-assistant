import * as admin from 'firebase-admin';

const showsRef = admin.firestore().collection('shows');

function getItems(inputFilters) {
  const filters = inputFilters || {};

  const limit = filters.limit || 3;

  return showsRef
    // .where('isKeynote', '==', true)
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

module.exports = {
  getItems: getItems
};
