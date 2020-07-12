import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';

export const streamRap = (
  isLoading: boolean,
  requested: () => void,
  received: (url: string) => void
) => {
  const requestRapStream = async (id: string): Promise<string> => axios.get(`/api/raps/stream/${id}`).then(resp => resp.data);

  return async (id: string) => {
    if (isLoading) return;

    requested();
    const url = await requestRapStream(id);
    received(url);
  };
};

export const useStreamRap = () => {
  const {
    player: { isLoading },
    actions: { audioStreamRequested, audioStreamReceived }
  } = useContext(AppContext);
  const requested = () => audioStreamRequested();
  const received = (url: string) => audioStreamReceived(url);

  return streamRap(isLoading, requested, received);
};