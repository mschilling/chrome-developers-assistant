'use strict';

const api = require('../helpers/api');
const responses = require('../helpers/responses');
const DialogflowOption = require('../helpers/option-helper');

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

// function genericOptionsHandler(assistant) {
//   const optionData = assistant.getSelectedOption();
//   console.log('2 optionData', optionData);
//   const dfo = DialogflowOption.fromString(optionData);
//   console.log('2 dfo', dfo);

//   if (dfo && dfo.value) {
//     assistant.ask( assistant.buildRichResponse()
//     .addSimpleResponse({
//       speech: 'Here you go',
//       displayText: 'Here you go'
//     })
//     .addSuggestionLink('blog on website', dfo.value));
//     return;
//   };
//   assistant.ask('Sorry, I could not find the show on YouTube');
// }

module.exports = {
  searchBlogPosts: handleAction
  // genericOptionsHandler: genericOptionsHandler
};
