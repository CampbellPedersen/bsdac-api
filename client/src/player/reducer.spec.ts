import { AudioPlayerState, playerReducer } from './reducer';
import { Rap, EventName } from '../raps/types';

describe('reducer', () => {
  const url = 'https:/rap.local';
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};

  test('when rap selected > should return state with selected rap', () => {
    const state: AudioPlayerState = { isLoading: false };
    const newState = playerReducer(state, { type: 'RapSelected', rap });

    expect(newState).toEqual({ isLoading: false, rap });
  });

  test('when audio stream requested > should return loading state', () => {
    const state: AudioPlayerState = { isLoading: false, streamUrl: 'https://rap.local' };
    const newState = playerReducer(state, { type: 'AudioStreamRequested' });

    expect(newState).toEqual({ isLoading: true, streamUrl: undefined });
  });

  test('given loading > when audio stream received > should return state with url', () => {
    const state: AudioPlayerState = { isLoading: true };
    const newState = playerReducer(state, { type: 'AudioStreamReceived', url });

    expect(newState).toEqual({ isLoading: false, streamUrl: url });
  });
});