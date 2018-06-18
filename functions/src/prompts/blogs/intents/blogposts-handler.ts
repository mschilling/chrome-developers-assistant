import { returnBasicCard } from "../../shared/responses";
import { Firestore } from "../../../shared/firestore";
import {
  BlogPostService,
  BlogPostServiceExt
} from "../../../services/blog-post-service";
import { Translations as Strings } from "../translations";
import { buildBrowseCarousel, buildSimpleCard } from "../../../utils/responses";
import { SimpleResponse } from "actions-on-google";

export async function searchBlogPosts(conv, params) {
  const filters = <any>{};
  const { person } = params;

  if (person) {
    filters.person = person;
  }

  const blogPostService = new BlogPostService(Firestore.db);
  const results = await blogPostService.search(filters, 10);

  if (results === null) {
    console.log("results (blogposts) is null");
    conv.ask(Strings.GeneralListNoResultsText);
    return;
  }

  if (results.length > 1) {
    conv.ask(Strings.GeneralListResultText);
    conv.ask(buildBrowseCarousel(BlogPostServiceExt.asCards(results)));
    return;
  } else {
    conv.ask(new SimpleResponse({
      speech: 'Here is a blog post',
      text: 'Here is a blog post'
    }));

    const simpleCardResponse = buildSimpleCard(
      BlogPostServiceExt.asCard(results[0])
    );
    conv.ask(simpleCardResponse);
    return;
  }
}
