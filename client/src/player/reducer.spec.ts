import { AudioPlayerState, playerReducer } from './reducer';

describe('reducer', () => {
  const url = 'https:/rap.local';

  test('when audio stream requested > should return loading state for rap id', () => {
    const state: AudioPlayerState = { isLoading: false, streamUrl: 'https://rap.local/old', rapId: 'rap-000' };
    const newState = playerReducer(state, { type: 'AudioStreamRequested', rapId: 'rap-001' });

    expect(newState).toEqual({ isLoading: true, rapId: 'rap-001', streamUrl: null });
  });

  test('given loading > when audio stream received > should return state with url', () => {
    const state: AudioPlayerState = { isLoading: true, rapId: 'rap-001', streamUrl: null };
    const newState = playerReducer(state, { type: 'AudioStreamReceived', url });

    expect(newState).toEqual({ isLoading: false, rapId: 'rap-001', streamUrl: url });
  });
});
