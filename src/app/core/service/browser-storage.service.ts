import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('BrowserStorage', {
  providedIn: 'root',
  factory: () => localStorage,
});

@Injectable({
  providedIn: 'root',
})
export class BrowserStorageService {
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) { }

  get(key: string) {
    return this.storage.getItem(key);
  }

  set(key: string, value: any) {
    let storable: string;
    switch (typeof value) {
      case 'object':
        storable = JSON.stringify(value);
        break;
      default:
        storable = value;
    }
    this.storage.setItem(key, storable);
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
