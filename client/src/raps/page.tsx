import React, { useContext, useEffect } from 'react';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { useLoadRaps } from './load-raps';
import { RapList } from './components/rap-list';
import './page.css';

export const RapsPage: React.FC = () => {
  const { raps: { isLoading, raps: loaded }} = useContext(AppContext);
  const loadRaps = useLoadRaps();

  useEffect(() => {
    if(!loaded) loadRaps();
  }, [loaded, loadRaps]);

  if (isLoading || !loaded) {
    return <LoadingScreen />;
  };

  return (
    <div className='raps-page'>
      <RapList raps={loaded}/>
    </div>
  );
};