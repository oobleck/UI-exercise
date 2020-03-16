export class MockStorageService {
  cache: any;
  get() {
    return JSON.stringify(this.cache);
  }
  set(key: string, value: any) {
    this.cache = value;
  }
  remove() {}

  reset() {
    this.cache = undefined;
  }
}
