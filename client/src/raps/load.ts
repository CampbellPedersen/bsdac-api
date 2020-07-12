import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from './types';

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
    received(raps);
    // received(JSON.parse('[{"bonus":true,"imageUrl":"https://i.imgur.com/Q7M3sh2.png","id":"0ba75e4d-080d-43ee-a615-c5769d7afc78","title":"A bonus track","lyrics":"Some other words mun","appearedAt":{"name":"BSDAC","series":11},"rapper":"Campbell Pedersen"},{"bonus":false,"imageUrl":"https://i.imgur.com/qJjv1Ba.jpg","id":"8c0ffd38-0c36-4e7d-bee4-903050ad43b4","title":"Another rap","lyrics":"Some other words mun","appearedAt":{"name":"BSDAC","series":11},"rapper":"Nathan Kosc"},{"bonus":false,"imageUrl":"https://i.imgur.com/AQRiRER.jpg","id":"11fb4ed4-d16a-4794-8770-42e5ec82af2c","title":"BigGreen\'s Back","lyrics":"Words mun","appearedAt":{"name":"BSDAC","series":12},"rapper":"Campbell Pedersen"}]'));
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