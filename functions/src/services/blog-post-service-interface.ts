import { BlogPost } from "../models/blog-post";

export interface IBlogPostService {
  search(searchParams: any, limit?: number): Promise<BlogPost[]>;
  getByKey(key: string): Promise<BlogPost>;
}
