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

export class RapSelected {
  readonly type = 'RapSelected';
  constructor(readonly rap: Rap) {}
}

export class AudioStreamRequested {
  readonly type = 'AudioStreamRequested';
}

export class AudioStreamReceived {
  readonly type = 'AudioStreamReceived';
  constructor(readonly url: string) {}
}

export class RapUploadProgressed {
  readonly type = 'RapUploadProgressed';
  constructor(readonly progress: number) {}
}

export class RapUploadFailed {
  readonly type = 'RapUploadFailed';
  constructor(readonly reason: string) {}
}

export class RapUploaded {
  readonly type = 'RapUploaded';
  constructor(readonly rap: Rap) {}
}

export type Action = LoginRequested | LoggedIn  | LoginFailed | RapsRequested | RapsLoaded | RapSelected | AudioStreamRequested | AudioStreamReceived | RapUploadProgressed | RapUploadFailed | RapUploaded;

export class Actions {
  loginRequested = this.dispatcher(LoginRequested);
  loggedIn = this.dispatcher(LoggedIn);
  loginFailed = this.dispatcher(LoginFailed);
  rapsRequested = this.dispatcher(RapsRequested);
  rapsLoaded = this.dispatcher(RapsLoaded);
  rapSelected = this.dispatcher(RapSelected);
  audioStreamRequested = this.dispatcher(AudioStreamRequested);
  audioStreamReceived = this.dispatcher(AudioStreamReceived);
  rapUploadProgressed = this.dispatcher(RapUploadProgressed);
  rapUploaded = this.dispatcher(RapUploaded);

  constructor(private readonly dispatch: React.Dispatch<Action>) { }

  private dispatcher<T extends { new(...args: any[]): any }>(action: T) {
    return (...args: ConstructorParameters<T>) => { this.dispatch(new action(...args)); };
  }
}