import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';

import { HomeRoutingModule } from './home.routing';
import { HomeComponent } from './page/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule],
  exports: [],
  providers: [],
  entryComponents: [],
})
export class HomeModule { }
