import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { loadRaps } from './load';
import { Rap, EventName } from './types';

describe('load', () => {
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};
  const requested = jest.fn<void, []>();
  const received = jest.fn<void, [Rap[]]>();
  const http = new MockAdapter(axios);

  beforeEach(() => {
    requested.mockReset();
    received.mockReset();
    http.reset();
    http.resetHistory();
  });

  test('when load raps > should make http request and make callbacks', async () => {
    http.onGet('/api/raps/get-all').reply(200, [ rap ]);

    const load = loadRaps(requested, received);
    await load();

    expect(requested).toBeCalled();
    expect(http.history.get.length).toEqual(1);
    expect(received).toBeCalledWith([ rap ]);
  });

  test('given api is broke > when load raps > should make http request and make requested callback', async () => {
    http.onGet('/api/raps/get-all').reply(500);

    const load = loadRaps(requested, received);
    await expect(load()).rejects.toThrow(new Error('Request failed with status code 500'));

    expect(requested).toBeCalled();
    expect(http.history.get.length).toEqual(1);
    expect(received).not.toBeCalled();
  });
});