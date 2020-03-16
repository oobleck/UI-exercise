import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './core';
import { CoreModule } from './core/core.module';
import { AuthLayoutComponent, ContentLayoutComponent, NavComponent } from './layout';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, ContentLayoutComponent, NavComponent, AuthLayoutComponent],
  imports: [
    // angular
    BrowserModule,

    // core & shared
    CoreModule,
    SharedModule,

    // app
    AppRoutingModule,

    BrowserAnimationsModule,
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent],
})
export class AppModule { }
