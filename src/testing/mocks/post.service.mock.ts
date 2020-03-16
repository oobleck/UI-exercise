import { of } from 'rxjs';
import { defaultMockPost } from './defaultMockPost';

export const mockPosts = new Array(12).fill(0).map((skip, pp) => ({
  ...defaultMockPost,
  id: pp + 1,
  userId: pp + 1,
}));

export class MockPostService {
  getPosts() {
    return of(mockPosts);
  }
  getPost() {
    return of(mockPosts[0]);
  }
  updatePost() {
    return of(mockPosts[0]);
  }
  createPost() {
    return of(mockPosts[0]);
  }
  deletePost() {
    return of();
  }
}
