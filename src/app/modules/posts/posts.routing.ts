import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService, PendingChangesGuard } from 'src/app/core';

import { ModifyPostComponent } from './pages/modify-post/modify-post.component';

const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'new',
        component: ModifyPostComponent,
        canDeactivate: [PendingChangesGuard],
        data: {
          routeLabel: 'New Post',
        },
      },
      {
        path: 'edit/:id',
        component: ModifyPostComponent,
        canDeactivate: [PendingChangesGuard],
        data: {
          routeLabel: 'Edit Post',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule { }
