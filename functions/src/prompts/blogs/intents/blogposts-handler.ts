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
    const speech = `
      <speak>
        <p>
          <s>I've found a blog online.</s>
          <s>It's called ${results[0].title}.</s>
        </p>
      </speak>`;

    const displayText = "Here's a blog I found online";

    conv.ask(
      new SimpleResponse({
        speech: speech,
        text: displayText
      })
    );

    const simpleCardResponse = buildSimpleCard(
      BlogPostServiceExt.asCard(results[0])
    );
    conv.ask(simpleCardResponse);
    return;
  }
}
