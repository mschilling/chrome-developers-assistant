const api = require('../helpers/api');
const responses = require('../helpers/responses');
const Str = require('../strings');

export async function searchBlogPosts(conv, params) {

  const filters = <any>{};
  const { person } = params;

  if (person) {
    filters.person = person;
  }
  console.log('searchBlogPosts', person);

  const results = await api.searchBlogPosts(filters, 10);
  if (results && results.length > 0) {
    const result = results[0];
    if (results.length > 1) {
      return await responses.returnBlogPostsResponse(conv, true, results);
    } else {
      return await responses.returnBasicCard(conv, 'blogpost', result);
    }
  } else {
    conv.ask(Str.DEFAULT_NO_RESULT.TEXT);
  }
  return;
}
