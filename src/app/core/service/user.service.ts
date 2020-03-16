import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { AuthCredentials, User } from 'src/app/data/schema';

import { subscribedContainerMixin } from '../mixins/unsubscribe.mixin';
import { BrowserStorageService } from './browser-storage.service';
import { RestApiService } from './rest-api.service';

const AUTH_KEY = 'authCredentials';

@Injectable({
  providedIn: 'root',
})
export class UserService extends subscribedContainerMixin() {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  usersHash = {};
  private users: User[] = [];

  get currentUser(): User {
    const user = this.storageService.get(AUTH_KEY);
    return user ? JSON.parse(user) : {};
  }

  get username(): string {
    return this.currentUser.username;
  }

  get userFullName(): string {
    return this.currentUser.name;
  }

  get isLoggedIn(): Observable<boolean> {
    return this.getUsers().pipe(map((users) => users.length && this.isValid()));
  }

  constructor(private restApi: RestApiService, private storageService: BrowserStorageService, private router: Router) {
    super();
    this.isLoggedIn.pipe(take(1)).subscribe((isValid) => this.isLoggedIn$.next(isValid));
  }

  isValid(): boolean {
    const currentUser = this.currentUser;

    return this.users.some((user) => user.username === currentUser.username);
  }

  login(credentials: AuthCredentials): Observable<boolean> {
    const validUser = this.users.find((user) => user.username === credentials.username);
    if (validUser) {
      this.storageService.set(AUTH_KEY, validUser);
    }
    this.isLoggedIn.pipe(takeUntil(this.destroyed$)).subscribe((isValid) => this.isLoggedIn$.next(isValid));
    return this.isLoggedIn$;
  }

  logout(): Observable<boolean> {
    this.isLoggedIn$.next(false);
    this.storageService.remove(AUTH_KEY);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl('/home'));
    return of(!this.isValid());
  }

  getUsers(): Observable<User[]> {
    return this.restApi.getUsers().pipe(
      map((users: User[]) => {
        this.users = users;
        this.usersHash = users.reduce((result, user) => {
          result[user.username] = result[user.id] = user;

          return result;
        }, {});
        return users;
      }),
      shareReplay(1)
    );
  }
}
