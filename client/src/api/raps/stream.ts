import axios from 'axios';
import { useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../context';
import { ApiResult } from '../types';

export const stream = (
  requested: (rapId: string) => void,
  received: (url: string) => void
) => {
  const requestRapStream = async (id: string): Promise<string> =>
    axios.get(`/api/raps/stream/${id}`)
      .then(resp => resp.data);

  return async (id: string) => {
    requested(id);
    const url = await requestRapStream(id);
    received(url.replace('localstack:4566', 'localhost:4566'));
  };
};

export const useStream = (rapId?: string): ApiResult<string> => {
  const {
    player: { isLoading, rapId: loadedRapId, streamUrl },
    actions: { audioStreamRequested, audioStreamReceived }
  } = useContext(AppContext);

  useEffect(() => {
    if (!rapId || isLoading || (loadedRapId === rapId && streamUrl !== null)) return;
    (async () => {
      await stream(audioStreamRequested, audioStreamReceived)(rapId);
    })();
  }, [rapId, isLoading, loadedRapId, streamUrl, audioStreamRequested, audioStreamReceived]);

  return useMemo(() => {
    if (!rapId || isLoading || loadedRapId !== rapId || streamUrl === null) return { state: 'loading', loading: true } as const;
    return { state: 'loaded', loading: false, data: streamUrl } as const;
  }, [rapId, isLoading, loadedRapId, streamUrl]);
};
