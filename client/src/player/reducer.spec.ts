import { AudioPlayerState, playerReducer } from './reducer';

describe('reducer', () => {
  const url = 'https:/rap.local';

  it('when audio stream requested > should return loading state', () => {
    const state: AudioPlayerState = { isLoading: false };
    const newState = playerReducer(state, { type: 'AudioStreamRequested' });

    expect(newState).toEqual({ isLoading: true });
  });
  it('when audio stream received > should return state with url', () => {
    const state: AudioPlayerState = { isLoading: true };
    const newState = playerReducer(state, { type: 'AudioStreamReceived', url });

    expect(newState).toEqual({ isLoading: false, streamUrl: url });
  });
});