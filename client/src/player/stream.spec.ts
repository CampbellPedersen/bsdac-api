import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { stream } from './stream';

describe('stream', () => {
  let requestedCalled = false;
  let receivedUrl: string | undefined;

  const requested = () => requestedCalled = true;
  const received = (url: string) => receivedUrl = url;
  const http = new MockAdapter(axios);

  beforeEach(() => {
    requestedCalled = false;
    receivedUrl = undefined;
    http.reset();
    http.resetHistory();
  });

  test('given loading > when stream > should not make http request or call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(200, 'https:/rap.local');

    const streamRap = stream(true, requested, received);
    await streamRap('1');

    expect(requestedCalled).toBeFalsy();
    expect(http.history.get.length).toEqual(0);
    expect(receivedUrl).toBeUndefined();
  });

  test('when stream > should make http request and call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(200, 'https:/rap.local');

    const streamRap = stream(false, requested, received);
    await streamRap('1');

    expect(requestedCalled).toBeTruthy();
    expect(http.history.get.length).toEqual(1);
    expect(receivedUrl).toEqual('https:/rap.local');
  });

  test('given api is broke > when stream > should make http request and call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(500);

    const streamRap = stream(false, requested, received);
    await expect(streamRap('1')).rejects.toThrow(new Error('Request failed with status code 500'));

    expect(requestedCalled).toBeTruthy();
    expect(http.history.get.length).toEqual(1);
    expect(receivedUrl).toBeFalsy();
  });
});