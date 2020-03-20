import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, zip } from 'rxjs';
import { filter, map, tap, takeUntil } from 'rxjs/operators';
import { PostService, UserService } from 'src/app/core';
import { subscribedContainerMixin } from 'src/app/core/mixins/unsubscribe.mixin';
import { Post, User } from 'src/app/data/schema';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ],
})
export class HomeComponent extends subscribedContainerMixin() implements OnInit {
  showSavedMessage = false;
  currentUser: User;
  users: User[] = [];
  usersHash: object = {};

  posts$ = new BehaviorSubject<Post[]>([]);

  isLoggedIn$: Observable<boolean>;

  paginationSize = 10;
  pages: number[] = [];
  showPageNumbers = true;
  currentPaginatedPage = 0;
  get nextPage(): number {
    return this.currentPage + this.paginationSize;
  }
  get currentPage(): number {
    return this.currentPaginatedPage * this.paginationSize;
  }

  constructor(
    private userService: UserService,
    private postService: PostService,
    readonly router: Router,
    private location: Location
  ) {
    super();
    this.currentUser = userService.currentUser;
    this.isLoggedIn$ = userService.isLoggedIn$.pipe(tap(() => (this.currentUser = userService.currentUser)));
    this.handlePostSaved();
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    zip(this.userService.getUsers(), this.postService.getPosts())
      .pipe(map(([ users, posts ]) => ({ users, posts })))
      .subscribe((results) => {
        this.users = results.users;
        this.usersHash = { ...this.userService.usersHash };

        this.setupPagination(results.posts);
        this.posts$.next(results.posts);
      });
  }

  setupPagination(posts: Post[]) {
    this.pages = new Array(Math.ceil(posts.length / this.paginationSize))
      .fill(0)
      .map((skip, pageNum: number) => pageNum + 1);
  }
  goToPage(pageNum: number) {
    this.currentPaginatedPage = pageNum;
  }

  canEditPost(post: Post): boolean {
    return this.currentUser && post.userId === this.currentUser.id;
  }

  handlePostSaved() {
    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd && event.snapshot.children.length === 0),
        takeUntil(this.destroyed$)
      )
      .subscribe((event: ActivationEnd) => {
        this.showSavedMessage = Boolean(event.snapshot.queryParams.postSaved);

        if (this.showSavedMessage) {
          this.location.replaceState('/home');
          window.setTimeout(() => {
            this.showSavedMessage = false;
          }, 3000);
        }
      });
  }
}
