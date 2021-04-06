import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { upload } from './upload';
import { Rap, EventName } from './types';

((global as unknown) as { FormData: unknown }).FormData = class FormData {
  data = [];
  append = (data: any) => { data }
};
describe('upload', () => {
  const file = 'This is a file, I swear.';
  const details = { title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};
  const rap: Rap = { id: 'rap-001', ...details };

  let requestedCalled = false;
  let uploadedRap: Rap | undefined;
  let failedMessage: string | undefined = undefined;

  const requested = () => requestedCalled = true;
  const progressed = () => {};
  const uploaded = (r: Rap) => uploadedRap = r;
  const errored = (m: string) => failedMessage = m;
  const http = new MockAdapter(axios);

  beforeEach(() => {
    requestedCalled = false;
    uploadedRap = undefined;
    failedMessage = undefined;
    http.reset();
    http.resetHistory();
  });

  test('given loading > when upload > should not make http request or call callbacks', async () => {
    http.onPost('/api/raps/save').reply(201, rap);

    const uploadRap = upload(true, requested, progressed, uploaded, errored);
    const success = await uploadRap(file, details);

    expect(success).toBeUndefined();

    expect(requestedCalled).toBeFalsy();
    expect(http.history.post.length).toEqual(0);
    expect(uploadedRap).toBeUndefined();
    expect(failedMessage).toBeUndefined();
  });

  test('when upload > should make http request and call callbacks', async () => {
    http.onPost('/api/raps/save').reply(201, rap);

    const uploadRap = upload(false, requested, progressed, uploaded, errored);
    const success = await uploadRap(file, details)

    expect(success).toEqual(true);

    expect(requestedCalled).toBeTruthy();
    expect(http.history.post.length).toEqual(1);
    expect(uploadedRap).toEqual(rap);

    expect(failedMessage).toBeUndefined();
  });

  test('given api is broke > when upload > should make http request and call callbacks', async () => {
    http.onPost('/api/raps/save').reply(500);

    const uploadRap = upload(false, requested, progressed, uploaded, errored);
    const success = await uploadRap(file, details)

    expect(success).toEqual(false);

    expect(requestedCalled).toBeTruthy();
    expect(http.history.post.length).toEqual(1);
    expect(failedMessage).toEqual('Upload failed, please try again later');

    expect(uploadedRap).toBeUndefined();
  });
});