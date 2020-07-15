import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from '../raps/types';

export const upload = (
  isLoading: boolean,
  requested: () => void,
  progressed: (progress: number) => void,
  uploaded: (rap: Rap) => void
) => {
  const requestUpload = async (details: Omit<Rap, 'id'>, file: Blob): Promise<Rap> => {
    const data = new FormData();
    data.append('file', file);
    data.append('details', JSON.stringify(details));
    const onUploadProgress = (progress: any) => progressed(Math.floor((progress.loaded * 100) / progress.total));
    return axios.post('/api/raps/save', data, { headers: { 'content-type': 'multipart/form-data'}, onUploadProgress })
      .then(resp => resp.data);
  } 

  return async (details: Omit<Rap, 'id'>, file: Blob) => {
    if (isLoading) return;

    requested();
    const rap = await requestUpload(details, file);
    await uploaded(rap);
  };
};

export const useUpload = () => {
  const {
    upload: { progress },
    actions: { rapUploadProgressed, rapUploaded }
  } = useContext(AppContext);
  const isLoading = progress !== undefined;
  const requested = () => rapUploadProgressed(0);
  const progressed = (p: number) => rapUploadProgressed(p);
  const uploaded = (rap: Rap) => rapUploaded(rap);

  return upload(isLoading, requested, progressed, uploaded);
};