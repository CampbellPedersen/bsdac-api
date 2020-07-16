import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from './types';

const delay = (
  cb: () => void,
  delay: number
) => new Promise(resolve => setTimeout(() => {cb(); resolve(); }, delay));

export const loadRaps = (
  isLoading: boolean,
  requested: () => void,
  received: (raps: Rap[]) => void
) => {
  const requestRaps = async (): Promise<Rap[]> => axios.get('/api/raps/get-all').then(resp => resp.data);

  return async () => {
    if (isLoading) return;

    requested();
    const raps = await requestRaps();
    await delay(() => received(raps), 1000);
  };
};

export const useLoadRaps = () => {
  const {
    raps: { isLoading },
    actions: { rapsRequested, rapsLoaded }
  } = useContext(AppContext);
  const requested = () => rapsRequested();
  const received = (raps: Rap[]) => rapsLoaded(raps);

  return loadRaps(isLoading, requested, received);
};