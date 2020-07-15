import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { login } from './login';
import { LocalStorage } from '../utils/mocks'

global.localStorage = new LocalStorage;

describe('login', () => {
  let requestedCalled = false;
  let loggedInCalled = false;
  let failedMessage: string | undefined;

  const requested = () => requestedCalled = true;
  const loggedIn = () => loggedInCalled = true;
  const failed = (message: string) => failedMessage = message;
  const http = new MockAdapter(axios);

  beforeEach(() => {
    requestedCalled = false;
    loggedInCalled = false;
    failedMessage = undefined;
    http.reset();
    http.resetHistory();
  });

  test('given loading > when login > should not make callbacks', async () => {
    http.onPost('/api/login', { email: 'test@bsdac.com', password: 'password' }).reply(200);

    const doLogin = login(true, requested, loggedIn, failed);
    await doLogin('test@bsdac.com', 'password');

    expect(http.history.post.length).toEqual(0);
    expect(requestedCalled).toBeFalsy();
    expect(loggedInCalled).toBeFalsy();
    expect(failedMessage).toBeUndefined();
  });

  test('when login > should make http request and call callbacks', async () => {
    http.onPost('/api/login', { email: 'test@bsdac.com', password: 'password' }).reply(200);

    const doLogin = login(false, requested, loggedIn, failed);
    await doLogin('test@bsdac.com', 'password');

    expect(requestedCalled).toBeTruthy();
    expect(http.history.post.length).toEqual(1);
    expect(localStorage.getItem('loggedIn')).toEqual('true')
    expect(loggedInCalled).toBeTruthy();

    expect(failedMessage).toBeUndefined();
  });

  test('when login with bad credentials > should make http request and call callbacks', async () => {
    http.onPost('/api/login', { email: 'test@bsdac.com', password: 'password' }).reply(401);

    const doLogin = login(false, requested, loggedIn, failed);
    await doLogin('test@bsdac.com', 'password');

    expect(requestedCalled).toBeTruthy();
    expect(http.history.post.length).toEqual(1);
    expect(failedMessage).toEqual('Incorrect email or password');

    expect(loggedInCalled).toBeFalsy();
  });
});