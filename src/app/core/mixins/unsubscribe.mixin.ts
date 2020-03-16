import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Constructor } from './constructor';

/**
 * Mixin class to automatically unsubscribe in component classes.
 */
export const subscribedContainerMixin = <T extends Constructor>(base: T = class { } as T) =>
  class extends base implements OnDestroy {
    destroyed$ = new Subject<void>();

    ngOnDestroy(): void {
      this.destroyed$.next();
    }
  };
