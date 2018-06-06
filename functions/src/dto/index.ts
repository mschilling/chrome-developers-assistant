const Debug = require('debug');
const debug = Debug('google-developer-assistant-api:debug');
const error = Debug('google-developer-assistant-api:error');

import { BlogPostsRepository } from './blog-posts';

// Configure logging for hosting platforms that only support console.log and console.error
debug.log = console.log.bind(console);
error.log = console.error.bind(console);

export class DTO {

  static BlogPosts = BlogPostsRepository

}
