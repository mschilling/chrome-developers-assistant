import { BlogPost } from './../../models/blog-post';
import { SimpleResponse } from "actions-on-google";
import { buildSimpleCard, buildBrowseCarousel } from '../../utils/responses';
import { BlogPostServiceExt } from '../../services/blog-post-service';
import { Conversation } from '../../utils/conversation';
import { Capabilities } from '../../utils/capabilities';

export function showOrBrowseBlogPosts(conv, items: BlogPost[]) {
  if (items.length === 1) {
    showBlogPost(conv, items[0]);
    return;
  } else if (items.length > 1) {
    browseBlogPosts(conv, items);
    return;
  }

  // Fallback when no blogs found
  showBlogPostNoResult(conv)

}

function showBlogPost(conv, blogPost: BlogPost) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `I've found a blog by ${blogPost.author}. It's called ${blogPost.title}.`,
      text: `Here's a blog by I found online`,
    })
  );

  const cardData = BlogPostServiceExt.asCard(blogPost);
  conversation.addElement(buildSimpleCard(cardData));

  conversation.complete();
}


function browseBlogPosts(conv, blogPosts: BlogPost[]) {

  const conversation = new Conversation(conv);

  const surfaceCapabilities = conv.capabilities as Capabilities;

  conversation.addElement(
    new SimpleResponse({
      speech: `I've found some blogs online.`,
      text: `Here's what I found`,
    })
  );

  const cardsData = BlogPostServiceExt.asCards(blogPosts);
  if(surfaceCapabilities.hasScreen && surfaceCapabilities.hasWebBrowser) {
    conversation.addElement(buildBrowseCarousel(cardsData));
  }

  conversation.complete();
}

function showBlogPostNoResult(conv) {

  const conversation = new Conversation(conv);

  conversation.addElement(
    new SimpleResponse({
      speech: `Sorry, I couldn't find any blogs just now. Please try something else.`,
      text: `Couldn't find any blogs`,
    })
  );

  conversation.addSuggestions(['Blogs by Jake', 'Blogs by Rob Dodson', 'Blogs by Monica']);

  conversation.complete();
}

