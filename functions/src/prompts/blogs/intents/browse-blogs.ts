import { Parameters } from './../../../dialogflow-constants';
import { Firestore } from '../../../shared/firestore';
import { BlogPostService } from '../../../services/blog-post-service';
import { showOrBrowseBlogPosts } from '../responses';

export async function browseBlogs(conv, params) {
  const filters = <any>{};
  const person = params[Parameters.SPEAKER];

  if (person) {
    filters.person = person;
  }

  const blogPostService = new BlogPostService(Firestore.db);
  const items = await blogPostService.search(filters, 10);

  showOrBrowseBlogPosts(conv, items);
}
