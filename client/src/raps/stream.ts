import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';

export const streamRap = (
  requested: () => void,
  received: (url: string) => void
) => {
  const requestRapStream = async (id: string): Promise<string> => axios.get(`/api/raps/stream/${id}`).then(resp => resp.data);

  return async (id: string) => {
    requested();
    const url = await requestRapStream(id);
    received(url);
  };
};

export const useStreamRap = () => {
  const {
    actions: { audioStreamRequested, audioStreamReceived }
  } = useContext(AppContext);
  const requested = () => audioStreamRequested();
  const received = (url: string) => audioStreamReceived(url);

  return streamRap(requested, received);
};