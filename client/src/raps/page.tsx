import React, { useContext } from 'react';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { useLoadRaps } from './load-raps';

export const RapsPage: React.FC = () => {
  const { raps: { loaded }} = useContext(AppContext);
  const loadRaps = useLoadRaps();

  if (!loaded) {
    loadRaps();
    return <LoadingScreen />;
  };

  return <>
    <h1>Loaded raps:</h1>
    <p><code>{JSON.stringify(loaded, null, '\t')}</code></p>
  </>;
};