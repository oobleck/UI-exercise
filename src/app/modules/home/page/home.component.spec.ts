import { Component } from '@angular/core';
import { async, ComponentFixture } from '@angular/core/testing';
import { PostService, UserService } from 'src/app/core';
import {
  initContext,
  MockCoreModule,
  MockPostService,
  MockSharedModule,
  MockUserService,
  TestContext,
} from 'src/testing';

import { HomeComponent } from './home.component';

@Component({
  template: `
    <app-home></app-home>
  `,
})
class TestComponent {}

describe('HomeComponent', () => {
  type Context = TestContext<HomeComponent, TestComponent>;
  let component: HomeComponent;
  let ctx: Context;
  let fixture: ComponentFixture<TestComponent>;

  initContext(HomeComponent, TestComponent, {
    imports: [ MockSharedModule, MockCoreModule ],
    providers: [
      {
        provide: UserService,
        useClass: MockUserService,
      },
      {
        provide: PostService,
        useClass: MockPostService,
      },
    ],
  });

  beforeEach(function(this: Context) {
    ctx = this;
    component = ctx.testedDirective;
    fixture = ctx.fixture;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  it(
    'should have users populated',
    async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.users.length).toBeGreaterThan(0);
      });
    })
  );

  it(
    'should have pagination set up (meaning posts are populated)',
    async(() => {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.pages.length).toBeGreaterThan(0);
      });
    })
  );
});
