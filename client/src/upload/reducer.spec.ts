import { UploadState, uploadReducer } from './reducer';
import { Rap, EventName } from '../api/raps/types';

describe('reducer', () => {
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};

  test('given not progressing and failed message > when rap progressed > should return state with progress', () => {
    const state: UploadState = { failedMessage: 'Bad upload' };
    const newState = uploadReducer(state, { type: 'RapUploadProgressed', progress: 0 });

    expect(newState).toEqual({ progress: 0 });
  });

  test('when rap progressed > should return state with progress', () => {
    const state: UploadState = { progress: 0 };
    const newState = uploadReducer(state, { type: 'RapUploadProgressed', progress: 50 });

    expect(newState).toEqual({ progress: 50 });
  });

  test('given progressing > when rap uploaded > should return state with no progression', () => {
    const state: UploadState = { progress: 100 };
    const newState = uploadReducer(state, { type: 'RapUploaded', rap });

    expect(newState).toEqual({ });
  });

  test('given progressing > when rap upload failed > should return state with failed message', () => {
    const state: UploadState = { progress: 50 };
    const newState = uploadReducer(state, { type: 'RapUploadFailed', reason: 'Bad upload' });

    expect(newState).toEqual({ failedMessage: 'Bad upload' });
  });
});