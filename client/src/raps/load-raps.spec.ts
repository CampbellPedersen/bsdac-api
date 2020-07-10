import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { loadRaps } from './load-raps';
import { Rap, EventName } from './types';

describe('load-raps', () => {
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};
  let requestedCalled = false;
  let receivedRaps: Rap[] | undefined;
  const requested = () => requestedCalled = true;
  const received = (raps: Rap[]) => receivedRaps = raps;
  const http = new MockAdapter(axios);

  beforeEach(() => {
    requestedCalled = false;
    receivedRaps = undefined;
    http.reset();
    http.resetHistory();
  });

  it('given loading > when load raps > should not make callbacks', async () => {
    http.onGet('/api/raps/get-all').reply(200, [ rap ]);

    const load = loadRaps(true, requested, received);
    await load();

    expect(requestedCalled).toBeFalsy();
    expect(http.history.get.length).toEqual(0);
    expect(receivedRaps).toBeFalsy();
  });

  it('when load raps > should make http request and make callbacks', async () => {
    http.onGet('/api/raps/get-all').reply(200, [ rap ]);

    const load = loadRaps(false, requested, received);
    await load();

    expect(requestedCalled).toBeTruthy();
    expect(http.history.get.length).toEqual(1);
    expect(receivedRaps).toEqual([ rap ]);
  });

  it('given api is broke > when load raps > should make http request and make requested callback', async () => {
    http.onGet('/api/raps/get-all').reply(500);

    const load = loadRaps(false, requested, received);
    await expect(load()).rejects.toThrow(new Error('Request failed with status code 500'));

    expect(requestedCalled).toBeTruthy();
    expect(http.history.get.length).toEqual(1);
    expect(receivedRaps).toBeFalsy();
  });
});