export interface PlaybackAudio {
  currentTime: number
}

export const preparePlayback = (
  audio: PlaybackAudio,
  preparedStreamUrl: { current?: string },
  streamUrl: string,
  startAtSeconds: number | undefined,
) => {
  if (preparedStreamUrl.current !== streamUrl) {
    preparedStreamUrl.current = streamUrl;
    if (startAtSeconds !== undefined) {
      audio.currentTime = startAtSeconds;
    }
  }
};
