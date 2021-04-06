import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context';
import { ApiResult } from '../types';
import { Rap } from './types';

const delay = (
  cb: () => void,
  delay: number
) => new Promise<void>(resolve => setTimeout(() => {cb(); resolve(); }, delay));

export const loadRaps = (
  requested: () => void,
  received: (raps: Rap[]) => void
) => {
  const requestRaps = async (): Promise<Rap[]> =>
    axios.get('/api/raps/get-all')
      .then(resp => resp.data);

  return async () => {
    requested();
    const raps = await requestRaps();
    await delay(() => received(raps), 1000);
  };
};

export const useRaps = (): ApiResult<Rap[], string> => {
  const {
    raps: { isLoading, data },
    actions: { rapsRequested, rapsLoaded }
  } = useContext(AppContext);

  useEffect(() => {
    if (isLoading || data === null) return;
    (async () => {
      await loadRaps(rapsRequested, rapsLoaded)();
    })();
  }, [isLoading, data, rapsRequested, rapsLoaded]);

  if (isLoading || data === null) return {state: 'loading', loading: true};
  return {state: 'loaded', loading: false, data}
};