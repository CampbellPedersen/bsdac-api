import React, { useContext, useEffect } from 'react';
import { useLoadRaps } from './load';
import { RapList } from './components/list';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { Player } from '../player/components/player';
import './page.scss';

export const RapsPage: React.FC = () => {
  const {
    raps: { isLoading, raps: loaded },
    actions: { rapSelected },
  } = useContext(AppContext);
  const loadRaps = useLoadRaps();

  useEffect(() => {
    if(!loaded) loadRaps();
  }, [loaded, loadRaps]);

  if (isLoading || !loaded) {
    return <LoadingScreen />;
  };

  return (
    <div className='raps-page'>
      <Player />
      <div className='row'>
        <div className='col'></div>
        <div className='col-12 col-lg-8'>
          <RapList raps={loaded} onSelect={rapSelected}/>
        </div>
        <div className='col'></div>
      </div>
    </div>
  );
};