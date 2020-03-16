import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthGuard, NoAuthGuard, PendingChangesGuard, RestApiService, throwIfAlreadyLoaded } from 'src/app/core';
import { fakeBackendProvider } from 'src/app/core/interceptor/fake-backend.interceptor';

@NgModule({
  imports: [HttpClientTestingModule],
  providers: [AuthGuard, NoAuthGuard, PendingChangesGuard, RestApiService, fakeBackendProvider],
})
export class MockCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: MockCoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'MockCoreModule');
  }
}
