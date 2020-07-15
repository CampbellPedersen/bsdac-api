import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from '../raps/types';

export const upload = (
  isLoading: boolean,
  requested: () => void,
  progressed: (progress: number) => void,
  uploaded: (rap: Rap) => void,
  errored: (message: string) => void
) => {
  const requestUpload = async (file: any, details: Omit<Rap, 'id'>): Promise<Rap> => {
    const data = new FormData();
    data.append('file', file);
    data.append('details', JSON.stringify(details));
    const onUploadProgress = (progress: any) => progressed(Math.floor((progress.loaded * 100) / progress.total));
    return axios.post('/api/raps/save', data, { headers: { 'content-type': 'multipart/form-data'}, onUploadProgress })
      .then(resp => resp.data)
  } 

  return async (file: any, details: Omit<Rap, 'id'>) => {
    if (isLoading) return;

    requested();
    try {
      const rap = await requestUpload(file, details);
      uploaded(rap);
    } catch (error) {
      errored('Upload failed, try again');
    }
  };
};

export const useUpload = () => {
  const {
    upload: { progress },
    actions: { rapUploadProgressed, rapUploaded, rapUploadFailed }
  } = useContext(AppContext);
  const isLoading = progress !== undefined;
  const requested = () => rapUploadProgressed(0);
  const progressed = (p: number) => rapUploadProgressed(p);
  const uploaded = (rap: Rap) => rapUploaded(rap);
  const failed = (message: string) => rapUploadFailed(message);

  return upload(isLoading, requested, progressed, uploaded, failed);
};