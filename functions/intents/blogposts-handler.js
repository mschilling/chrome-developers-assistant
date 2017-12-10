'use strict';

const api = require('../helpers/api');
const responses = require('../helpers/responses');

// Context Parameters
const EVENT_PARAM = 'summit';
const TAGS_PARAM = 'tags';
const SPEAKERS_PARAM = 'speakers';

function handleAction(assistant) {
  api.searchBlogPosts({}, 10)
    .then(results => {
      console.log('The number of blogposts found: ' + (results || []).length);
      if (results && results.length > 0) {
        const result = results[0];
        const blogParams = {
          id: result.id,
          title: result.title,
          url: result.postUrl,
          date: result.publishDate
        };
        if (results.length > 1) {
          responses.returnBlogPostsResponse(assistant, true, results, blogParams);
        } else {
          responses.returnBlogPostResponse(assistant, true, blogParams);
        }
      } else {
        responses.returnBlogPostResponse(assistant, false);
      }
    });
}

module.exports = {
  searchBlogPosts: handleAction
};
