import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';

import { AuthRoutingModule } from './auth.routing';
import { LoginComponent } from './page/login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
})
export class AuthModule { }
