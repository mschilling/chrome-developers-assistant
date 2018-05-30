import * as admin from 'firebase-admin';

const blogPostsRef = admin.firestore().collection('blogposts');

function searchHandler(searchParams, limit = 10) {
  if (!searchParams) {
    debug('searchParams is undefined');
    return undefined;
  };

  let query: any = blogPostsRef;

  if (searchParams.person) {
    query = query.where(`authors.${searchParams.person}`, '==', true);
  }

  if (!searchParams.person) {
    query = query.orderBy('publishDate', 'desc');
  }

  return query
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

function getByKey(key) {
  if (!key) {
    debug('key is undefined');
    return null;
  };

  return blogPostsRef
    .doc(key)
    .get()
    .then(snapshot => {
      return snapshot.data();
    });
}

module.exports = {
  search: searchHandler,
  getByKey: getByKey
};
