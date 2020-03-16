import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { AuthGuard, NoAuthGuard, PendingChangesGuard, throwIfAlreadyLoaded } from './guard';
import { fakeBackendProvider } from './interceptor/fake-backend.interceptor';
import { RestApiService } from './service';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    AuthGuard,
    NoAuthGuard,
    PendingChangesGuard,
    RestApiService,
    fakeBackendProvider,
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
