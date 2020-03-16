import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent, ContentLayoutComponent } from 'src/app/layout';
import { AuthGuardService } from './core';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: ContentLayoutComponent,
    loadChildren: () => import('src/app/modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '',
    component: ContentLayoutComponent,
    canLoad: [ AuthGuardService ],
    children: [
      {
        path: 'posts',
        loadChildren: () => import('src/app/modules/posts/posts.module').then((m) => m.PostsModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('src/app/modules/auth/auth.module').then((m) => m.AuthModule),
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false, paramsInheritanceStrategy: 'always' }) ],
  exports: [ RouterModule ],
  providers: [],
})
export class AppRoutingModule {}
