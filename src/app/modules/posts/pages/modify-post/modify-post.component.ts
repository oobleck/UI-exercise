import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate, PostService, UserService } from 'src/app/core';
import { subscribedContainerMixin } from 'src/app/core/mixins/unsubscribe.mixin';
import { Post } from 'src/app/data/schema';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './modify-post.component.html',
  styleUrls: [ './modify-post.component.scss' ],
})
export class ModifyPostComponent extends subscribedContainerMixin() implements ComponentCanDeactivate {
  postForm: FormGroup;
  postId: number;
  isEditMode = false;
  saving = false;
  deleting = false;

  get form(): { [key: string]: AbstractControl } {
    return this.postForm.controls;
  }

  get isButtonDisabled(): boolean {
    return this.isActionHappening || this.postForm.invalid || null;
  }

  get isActionHappening(): boolean {
    return this.saving || null;
  }

  get post(): Post {
    return {
      id: this.postId,
      ...this.postForm.value,
    };
  }

  constructor(
    private fb: FormBuilder,
    readonly activatedRoute: ActivatedRoute,
    private router: Router,
    private postsService: PostService,
    private userService: UserService
  ) {
    super();
    const stateParams = activatedRoute.snapshot.params;
    this.initFormGroup();
    this.isEditMode = !isNaN(stateParams.id);

    if (this.isEditMode) {
      this.postId = Number(stateParams.id);
      this.getPostToModify(this.postId);
    }
  }

  private initFormGroup() {
    this.postForm = this.fb.group({
      title: [ '', Validators.compose([ Validators.required, Validators.maxLength(200) ]) ],
      body: [ '', Validators.compose([ Validators.required, Validators.maxLength(2000) ]) ],
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return this.postForm.pristine || this.saving || this.deleting;
  }

  submitPost() {
    this.saving = true;
    const currentUser = this.userService.currentUser;
    const submitMethod = (this.isEditMode ? this.postsService.updatePost : this.postsService.createPost).bind(
      this.postsService
    );
    const post = this.post;

    if (!this.isEditMode) {
      post.userId = currentUser.id;
    }

    submitMethod(post).pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (this.isEditMode) {
        this.router.navigateByUrl('/home?postSaved=true');
      } else {
        this.cancel();
      }
    });
  }

  deletePost() {
    this.deleting = true;
    const confirmation = window.confirm('WARNING: Are you sure you want to delete this post?');

    if (confirmation) {
      this.postsService.deletePost(this.postId).pipe(takeUntil(this.destroyed$)).subscribe(this.cancel.bind(this));
    }
  }

  getPostToModify(postId: number) {
    this.postsService.getPost(postId).pipe(takeUntil(this.destroyed$)).subscribe((post) => {
      const { title, body } = post;

      this.postForm.patchValue({
        title,
        body,
      });
    });
  }

  cancel() {
    this.router.navigateByUrl('/home');
  }
}
