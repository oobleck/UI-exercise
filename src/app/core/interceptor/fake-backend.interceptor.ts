import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Post } from 'src/app/data/schema';

let posts: Post[] = [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = request;

    return of(null).pipe(mergeMap(handleRoute));

    function handleRoute() {
      let postId: any;
      switch (true) {
        case url.endsWith('/posts') && method === 'GET':
          return getPosts();

        case url.endsWith('/posts') && method === 'POST':
          return addPost();

        case url.match(/\/posts\/[\d]+$/i) && method === 'GET':
          postId = url.slice(url.lastIndexOf('/') + 1);
          return getPost(+postId);

        case url.match(/\/posts\/[\d]+$/i) && method === 'PATCH':
          return updatePost(body);

        case url.match(/\/posts\/[\d]+$/i) && method === 'DELETE':
          postId = url.slice(url.lastIndexOf('/') + 1);
          return deletePost(+postId);

        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // Route functions
    function getPosts(): Observable<HttpEvent<any>> {
      console.log('Interceptor: getPosts', request);
      if (!posts.length) {
        return next.handle(request).pipe(
          tap((ev: HttpEvent<any>) => {
            if (ev instanceof HttpResponse) {
              posts = ev.body;
            }
          })
        );
      }

      return ok(posts);
    }

    function getPost(postId: number): Observable<HttpEvent<any>> {
      console.log('Interceptor: getPost', request);
      if (!posts.length) {
        return next.handle(request);
      }

      return ok(posts.find((post) => post.id === postId));
    }

    function updatePost(modPost: Post): Observable<HttpEvent<any>> {
      console.log('Interceptor: updatePost', request);

      // Replace matching post with updated post
      posts.map((post) => (post.id === modPost.id ? modPost : post));

      return ok(modPost);
    }

    function addPost(): Observable<HttpEvent<any>> {
      console.log('Interceptor: addPost', request);
      return next.handle(request).pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            // This adds the placeholder response to the list of posts for
            // additional listing & editing (until user reloads).
            ev.body.id = Date.now();
            posts.unshift(ev.body);
          }
        })
      );
    }

    function deletePost(postId: number): Observable<HttpEvent<any>> {
      console.log('Interceptor: deletePost', request);
      return next.handle(request).pipe(tap(() => (posts = posts.filter((post) => post.id !== postId))));
    }

    // Helper functions
    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }));
    }
  }
}

// use fake backend in place of Http service for backend-less development
export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
