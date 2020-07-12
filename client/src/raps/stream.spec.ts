import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { streamRap } from './stream';

describe('stream-rap', () => {
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

  it('given loading > when stream > should not make callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(200, 'https:/rap.local');

    const doStreamRap = streamRap(true, requested, received);
    await doStreamRap('1');

    expect(http.history.post.length).toEqual(0);
    expect(requestedCalled).toBeFalsy();
    expect(receivedUrl).toBeUndefined();
  });

  it('when stream > should make http request and call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(200, 'https:/rap.local');

    const doStreamRap = streamRap(false, requested, received);
    await doStreamRap('1');

    expect(requestedCalled).toBeTruthy();
    expect(http.history.get.length).toEqual(1);
    expect(receivedUrl).toEqual('https:/rap.local');
  });

  it('given api is broke > when stream > should make http request and call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(500);

    const doStreamRap = streamRap(false, requested, received);
    await expect(doStreamRap('1')).rejects.toThrow(new Error('Request failed with status code 500'));

    expect(requestedCalled).toBeTruthy();
    expect(http.history.get.length).toEqual(1);
    expect(receivedUrl).toBeFalsy();
  });
});