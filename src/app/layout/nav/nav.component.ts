import { Component } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core';
import { subscribedContainerMixin } from 'src/app/core/mixins/unsubscribe.mixin';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent extends subscribedContainerMixin() {
  isLoggedIn = false;
  showPostButtons = true;
  showBackLink = false;
  pageName: string;

  get username(): string {
    return this.userService.currentUser.username;
  }

  get userFullName(): string {
    return this.userService.currentUser.name;
  }

  constructor(readonly userService: UserService, private router: Router, readonly activatedRoute: ActivatedRoute) {
    super();
    userService.isLoggedIn$.subscribe((isValid) => (this.isLoggedIn = isValid));
    this.router.events
      .pipe(
        filter((event) => event instanceof ActivationEnd && event.snapshot.children.length === 0),
        takeUntil(this.destroyed$)
      )
      .subscribe((event: ActivationEnd) => {
        this.pageName = (event.snapshot.data && event.snapshot.data.routeLabel) || 'Home';
        this.showPostButtons = !this.router.url.includes('/post');
        this.showBackLink = !this.router.url.includes('home');
      });
  }

  logout() {
    this.userService.logout();
  }

  login() {
    this.router.navigateByUrl('/auth/login');
  }

  newPost() {
    this.router.navigateByUrl('/posts/new');
  }
}
