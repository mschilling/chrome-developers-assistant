'use strict';

const api = require('../helpers/api');
const responses = require('../helpers/responses');

function handleAction(assistant) {
  const filters = {};

  if (assistant.getArgument('person')) {
    filters.person = assistant.getArgument('person');
  }

  api.searchBlogPosts(filters, 10)
    .then(results => {
      if (results && results.length > 0) {
        const result = results[0];
        if (results.length > 1) {
          responses.returnBlogPostsResponse(assistant, true, results);
        } else {
          responses.returnBasicCard(assistant, 'blogpost', result);
        }
      } else {
        responses.returnBlogPostResponse(assistant, false);
      }
    });
}

module.exports = {
  searchBlogPosts: handleAction
};
