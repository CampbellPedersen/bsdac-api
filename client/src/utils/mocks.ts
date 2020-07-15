export class LocalStorage {
  store: { [key: string]: string} = {}
  constructor() {}

  get length() {return Object.keys(this.store).length; }
  getItem = (key: string) => this.store[key] || null
  setItem = (key: string, value: string) => this.store[key] = value.toString();
  removeItem = (key: string) => delete(this.store[key]);
  clear = () => this.store = {};
  key = () => null
};