import { LoginState, loginReducer } from './reducer';

describe('reducer', () => {
  const failedMessage = 'Invalid email or password';

  test('given not logged in > when login requested > should return loading state', () => {
    const state: LoginState = { loggedIn: false, isLoading: false, failedMessage };
    const newState = loginReducer(state, { type: 'LoginRequested' });

    expect(newState).toEqual({ loggedIn: false, isLoading: true, failedMessage: undefined });
  });
  test('given not logged in > when logged in > should return state logged in', () => {
    const state: LoginState = { loggedIn: false, isLoading: true };
    const newState = loginReducer(state, { type: 'LoggedIn' });

    expect(newState).toEqual({ loggedIn: true, isLoading: false });
  });

  test('given not logged in > when login failed > should return not logged in state', () => {
    const state: LoginState = { loggedIn: false, isLoading: true };
    const newState = loginReducer(state, { type: 'LoginFailed', reason: failedMessage });

    expect(newState).toEqual({ loggedIn: false, isLoading: false, failedMessage });
  });
});