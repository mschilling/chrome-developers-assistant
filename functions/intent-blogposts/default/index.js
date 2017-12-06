'use strict';

const api = require('../../helpers/api');
const responses = require('../../helpers/responses');

// Context Parameters
const EVENT_PARAM = 'summit';
const TAGS_PARAM = 'tags';
const SPEAKERS_PARAM = 'speakers';

function handleAction(assistant) {
  const params = parseParameters(assistant);

  api.searchBlogPosts(params, 10)
    .then(results => {
      console.log('Number of blogposts found: ' + (results || []).length);
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

function parseParameters(assistant) {
  // const eventParam = assistant.getArgument(EVENT_PARAM);
  // const tagsParam = assistant.getArgument(TAGS_PARAM) || [];
  // const speakersParam = assistant.getArgument(SPEAKERS_PARAM) || [];

  // console.log(eventParam, tagsParam, speakersParam);

  const params = {};

  // if (eventParam) {
  //   params.event = eventParam;
  // }

  // if (tagsParam) {
  //   params.tags = tagsParam;
  // }

  // if (speakersParam) {
  //   params.speakers = speakersParam;
  // }

  return params;
}

module.exports = {
  handleAction: handleAction
};
