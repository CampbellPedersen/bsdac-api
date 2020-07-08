import { LoginState, loginReducer } from './reducer';

describe('reducer', () => {
  it('given not logged in > when logged in > should return state logged in', () => {
    const state: LoginState = { loggedIn: false };
    const newState = loginReducer(state, { type: 'LoggedIn' });

    expect(newState).toEqual({ loggedIn: true });
  });
});