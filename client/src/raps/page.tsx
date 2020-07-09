import React, { useContext, useEffect } from 'react';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { useLoadRaps } from './load-raps';

export const RapsPage: React.FC = () => {
  const { raps: { isLoading, loaded }} = useContext(AppContext);
  const loadRaps = useLoadRaps();

  useEffect(() => {
    if(!loaded) loadRaps();
  }, [loaded, loadRaps]);

  if (isLoading) {
    return <LoadingScreen />;
  };

  return <>
    <h1>Loaded raps:</h1>
    <p><code>{JSON.stringify(loaded, null, '\t')}</code></p>
  </>;
};