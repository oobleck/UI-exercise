import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, UrlSegment } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userService.isValid()) {
      return true;
    }
    this.router.navigateByUrl('/home', {
      queryParams: {
        return: state.url,
      },
    });

    return false;
  }

  // canLoad(route: ActivatedRouteSnapshot, segments: UrlSegment[]): boolean {
  //   if (this.userService.isValid()) {
  //     return true;
  //   }
  //   this.router.navigateByUrl('/home');

  //   return false;
  // }
}
