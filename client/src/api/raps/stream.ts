import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context';
import { ApiResult } from '../types';

export const stream = (
  requested: () => void,
  received: (url: string) => void
) => {
  const requestRapStream = async (id: string): Promise<string> =>
    axios.get(`/api/raps/stream/${id}`)
      .then(resp => resp.data);

  return async (id: string) => {
    requested();
    const url = await requestRapStream(id);
    received(url.replace('localstack:4566', 'localhost:4566'));
  };
};

export const useStream = (rapId?: string): ApiResult<string, string> => {
  const {
    player: { isLoading, streamUrl },
    actions: { audioStreamRequested, audioStreamReceived }
  } = useContext(AppContext);

  useEffect(() => {
    if (!rapId || isLoading || streamUrl === null) return;
    (async () => {
      await stream(audioStreamRequested, audioStreamReceived)(rapId);
    })();
  }, [rapId, isLoading, streamUrl, audioStreamRequested, audioStreamReceived]);

  if (isLoading || streamUrl === null) return {state: 'loading', loading: true};
  return {state: 'loaded', loading: false, data: streamUrl}
};