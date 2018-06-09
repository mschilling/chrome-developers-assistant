import { DataApi as api } from "../../../shared/data-api";
import { returnBlogPostsResponse, returnBasicCard } from "../../shared/responses";

export async function searchBlogPosts(conv, params) {

  const filters = <any>{};
  const { person } = params;

  if (person) {
    filters.person = person;
  }

  const results = await api.searchBlogPosts(filters, 10);
  if (results && results.length > 0) {
    const result = results[0];
    if (results.length > 1) {
      returnBlogPostsResponse(conv, true, results);
    } else {
      returnBasicCard(conv, 'blogpost', result);
    }
  } else {
    conv.ask('Sorry, there\'s no result right now. Please try something else.');
  }
}
