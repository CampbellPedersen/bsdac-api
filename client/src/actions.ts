import { Rap } from './raps/types';

export class LoggedIn {
  readonly type = 'LoggedIn';
}

export class LoggedOut {
  readonly type = 'LoggedOut';
}

export class RapsLoaded {
  readonly type = 'RapsLoaded';
  constructor(readonly raps: Rap[]) {}
}

export type Action = LoggedIn | LoggedOut | RapsLoaded

export class Actions {
  loggedIn = this.dispatcher(LoggedIn);
  loggedOut = this.dispatcher(LoggedOut);
  rapsLoaded = this.dispatcher(RapsLoaded);

  constructor(private readonly dispatch: React.Dispatch<Action>) { }

  private dispatcher<T extends { new(...args: any[]): any }>(action: T) {
    return (...args: ConstructorParameters<T>) => { this.dispatch(new action(...args)); };
  }
}