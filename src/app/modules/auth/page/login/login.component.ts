import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core';
import { subscribedContainerMixin } from 'src/app/core/mixins/unsubscribe.mixin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends subscribedContainerMixin() {
  error: string;
  isLoading = false;
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    super();
    this.buildForm();
  }

  get form(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  login() {
    this.isLoading = true;

    const credentials = this.loginForm.value;

    this.userService
      .login(credentials)
      .pipe(
        map((isValid) => {
          if (!isValid) {
            this.error = 'Unknown username. Please try again.';
          }
          this.isLoading = false;
          return isValid;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((result) => result && this.router.navigateByUrl('/home'));
  }

  private buildForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
    });
  }
}
