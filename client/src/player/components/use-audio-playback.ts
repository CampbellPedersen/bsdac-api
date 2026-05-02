import { useEffect, useRef, useState } from 'react';
import { preparePlayback } from './audio-playback';

export const useAudioPlayback = (
  streamUrl?: string,
  startAtSeconds?: number,
) => {
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const preparedStreamUrl = useRef<string | undefined>();

  const prepareAudio = () => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return undefined;

    return {
      audio,
      streamUrl,
    };
  };

  const handlePlaybackReady = () => {
    const prepared = prepareAudio();
    if (!prepared) return;

    preparePlayback(prepared.audio, preparedStreamUrl, prepared.streamUrl, startAtSeconds);
  };

  const handleCanPlay = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (streamUrl) {
      setLoading(true);
      const audio = audioRef.current;
      if (audio) {
        audio.load();
      }
    } else {
      preparedStreamUrl.current = undefined;
      setLoading(false);
    }
  }, [startAtSeconds, streamUrl]);

  return {
    audioRef,
    handlePlaybackReady,
    handleCanPlay,
    loading,
  };
};
