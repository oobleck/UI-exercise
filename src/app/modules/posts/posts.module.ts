import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PostService, RestApiService } from 'src/app/core/service';
import { SharedModule } from 'src/app/shared';

import { ModifyPostComponent } from './pages/modify-post/modify-post.component';
import { PostsRoutingModule } from './posts.routing';

@NgModule({
  entryComponents: [ModifyPostComponent],
  declarations: [ModifyPostComponent],
  imports: [CommonModule, SharedModule, PostsRoutingModule],
  providers: [PostService, RestApiService],
})
export class PostsModule { }
