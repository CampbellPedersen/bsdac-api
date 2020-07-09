import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from './types';

const loadRaps = (
  isLoading: boolean,
  requested: () => void,
  received: (raps: Rap[]) => void
) => {
  const requestRaps = async (): Promise<Rap[]> => axios.get('/api/raps/get-all');

  return async () => {
    if (isLoading) return;

    requested();
    const raps = await requestRaps();
    received(raps);
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