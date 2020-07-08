import React, { useContext } from 'react';
import { AppContext } from '../context';

export const RapsPage: React.FC = () => {
  const {
    raps: { loaded }
  } = useContext(AppContext);

  return <>
    Number of raps loaded: {loaded?.length}
  </>;
};