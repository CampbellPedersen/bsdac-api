import React, { useContext, useEffect } from 'react';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { useLoadRaps } from './load';
import { RapList } from './components/list';
import { RapFilters } from './components/filters';
import './page.scss';

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
      <div className='row'>
        <div className='col-3'>
          <RapFilters raps={loaded} />
        </div>
        <div className='col-12 col-md-9'>
          <RapList raps={loaded}/>
        </div>
      </div>
    </div>
  );
};