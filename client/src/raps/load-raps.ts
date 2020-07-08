import axios from 'axios';
import { useContext, useState } from 'react';
import { AppContext } from '../context';
import { Rap } from './types';

const loadRaps = (
  isLoading: boolean,
  rapsRequested: () => void,
  rapsReceived: (raps: Rap[]) => void
) => {
  const requestRaps = async (): Promise<Rap[]> => axios.get('/api/raps/get-all');

  return async () => {
    if (isLoading) return;

    rapsRequested();
    const raps = await requestRaps();
    rapsReceived(raps);
  };
};

export const useLoadRaps = () => {
  const { actions: { rapsLoaded } } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const rapsRequested = () => setIsLoading(true);
  const rapsReceived = (raps: Rap[]) => { rapsLoaded(raps); setIsLoading(false); };

  return loadRaps(isLoading, rapsRequested, rapsReceived);
};