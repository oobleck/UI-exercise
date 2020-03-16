import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay, tap } from 'rxjs/operators';
import { Post, User } from 'src/app/data/schema';

import { API_ENDPOINT_BASE } from '../constants';

function url(...args: any): string {
  return [ API_ENDPOINT_BASE, ...args ].join('/');
}

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private users$: Observable<User[]>;
  private posts$: Observable<Post[]>;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    if (!this.users$) {
      this.users$ = this.getUsersOnce().pipe(shareReplay(1));
    }

    return this.users$;
  }
  private getUsersOnce(): Observable<User[]> {
    return this.standardGet<User[]>(url('users'));
  }

  getPosts(): Observable<Post[]> {
    if (!this.posts$) {
      this.posts$ = this.getPostsOnce();
    }
    return this.posts$;
  }
  private getPostsOnce(): Observable<Post[]> {
    return this.standardGet<Post[]>(url('posts'));
  }

  getPost(postId: number) {
    return this.standardGet<Post>(url('posts', postId));
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.patch<Post>(url('posts', post.id), post).pipe(retry(1), catchError(this.handleError));
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(url('posts'), post).pipe(retry(1), catchError(this.handleError));
  }

  deletePost(postId: number): Observable<Post> {
    return this.http.delete<Post>(url('posts', postId)).pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any): Observable<never> {
    const errorMessage: string =
      error.error instanceof ErrorEvent
        ? // Get client-side error
          error.error.message
        : // Get server-side error
          `Error Code: ${error.status}\nMessage: ${error.message}`;

    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private standardGet<T>(uriPath, ...params): Observable<T> {
    return this.http.get<T>(uriPath, ...params).pipe(retry(1), catchError(this.handleError));
  }
}
