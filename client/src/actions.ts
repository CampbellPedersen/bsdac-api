import { Rap } from './raps/types';

export class LoginRequested {
  readonly type = 'LoginRequested';
}

export class LoggedIn {
  readonly type = 'LoggedIn';
}

export class LoginFailed {
  readonly type = 'LoginFailed';
  constructor(readonly reason: string) {}
}

export class RapsRequested {
  readonly type = 'RapsRequested';
}

export class RapsLoaded {
  readonly type = 'RapsLoaded';
  constructor(readonly raps: Rap[]) {}
}

export type Action = LoginRequested | LoggedIn  | LoginFailed | RapsRequested | RapsLoaded

export class Actions {
  loginRequested = this.dispatcher(LoginRequested);
  loggedIn = this.dispatcher(LoggedIn);
  loginFailed = this.dispatcher(LoginFailed);
  rapsRequested = this.dispatcher(RapsRequested);
  rapsLoaded = this.dispatcher(RapsLoaded);

  constructor(private readonly dispatch: React.Dispatch<Action>) { }

  private dispatcher<T extends { new(...args: any[]): any }>(action: T) {
    return (...args: ConstructorParameters<T>) => { this.dispatch(new action(...args)); };
  }
}