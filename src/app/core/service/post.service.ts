import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from 'src/app/data/schema';

import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private restApi: RestApiService) { }

  getPosts(): Observable<Post[]> {
    return this.restApi.getPosts();
  }

  getPost(postId: number): Observable<Post> {
    return this.restApi.getPost(postId);
  }

  updatePost(post: Post): Observable<Post> {
    return this.restApi.updatePost(post);
  }
  createPost(post: Post): Observable<Post> {
    return this.restApi.createPost(post);
  }
  deletePost(postId: number): Observable<Post> {
    return this.restApi.deletePost(postId);
  }
}
