import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PostService, UserService } from 'src/app/core';
import { ControlMessagesComponent } from 'src/app/shared';

import { MockPostService, MockUserService } from 'src/testing';

const routerStub = {
  navigate: jasmine.createSpy('navigate'),
  navigateByUrl: jasmine.createSpy('navigateByUrl'),
  events: of(),
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
  declarations: [ControlMessagesComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, ControlMessagesComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    FormBuilder,
    {
      provide: Router,
      useValue: routerStub,
    },
    {
      provide: UserService,
      useClass: MockUserService,
    },
    {
      provide: PostService,
      useClass: MockPostService,
    },
  ],
})
export class MockSharedModule { }
