import { PlaybackAudio, preparePlayback } from './audio-playback';

describe('audio-playback', () => {
  test('when starting fresh stream > should seek to start time', () => {
    const audio: PlaybackAudio = {
      currentTime: 0,
    };
    const preparedStreamUrl = { current: undefined as string | undefined };

    preparePlayback(audio, preparedStreamUrl, 'https://rap.local/stream', 42);

    expect(audio.currentTime).toEqual(42);
    expect(preparedStreamUrl.current).toEqual('https://rap.local/stream');
  });

  test('when replaying same stream > should not reseek', () => {
    const audio: PlaybackAudio = {
      currentTime: 12,
    };
    const preparedStreamUrl = { current: 'https://rap.local/stream' };

    preparePlayback(audio, preparedStreamUrl, 'https://rap.local/stream', 42);

    expect(audio.currentTime).toEqual(12);
  });
});
