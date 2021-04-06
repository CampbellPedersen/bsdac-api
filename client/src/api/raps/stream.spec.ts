import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { stream } from './stream';

describe('stream', () => {
  const requested = jest.fn<void, []>();
  const received = jest.fn<void, [string]>();
  const http = new MockAdapter(axios);

  beforeEach(() => {
    requested.mockReset()
    received.mockReset();
    http.reset();
    http.resetHistory();
  });

  test('when stream > should make http request and call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(200, 'https:/rap.local');

    const streamRap = stream(requested, received);
    await streamRap('1');

    expect(requested).toBeCalled();
    expect(http.history.get.length).toEqual(1);
    expect(received).toBeCalledWith('https:/rap.local');
  });

  test('given api is broke > when stream > should make http request and call callbacks', async () => {
    http.onGet('/api/raps/stream/1').reply(500);

    const streamRap = stream(requested, received);
    await expect(streamRap('1')).rejects.toThrow(new Error('Request failed with status code 500'));

    expect(requested).toBeCalled();
    expect(http.history.get.length).toEqual(1);
    expect(received).not.toBeCalled();
  });
});