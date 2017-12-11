'use strict';

const api = require('../helpers/api');
const responses = require('../helpers/responses');
const Str = require('../strings');

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
        assistant.ask(Str.DEFAULT_NO_RESULT.TEXT);
      }
    });
}

module.exports = {
  searchBlogPosts: handleAction
};
