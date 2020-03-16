import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ControlMessagesComponent } from './component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  declarations: [ControlMessagesComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ControlMessagesComponent],
  providers: [FormBuilder],
})
export class SharedModule { }
