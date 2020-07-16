import React, { useContext, useEffect } from 'react';
import { useLoadRaps } from './load';
import { RapList } from './components/list';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { Player } from '../player/components/player';
import logo from '../images/logo.svg'
import './page.scss';
import { UploadModal } from '../upload/components/modal';

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
      <RapsNav />
      <div className='raps-list container'>
        <div className='row'>
          <div className='col'></div>
          <div className='col-12 col-lg-8'>
            <RapList raps={loaded} onSelect={rapSelected}/>
          </div>
          <div className='col'></div>
        </div>
      </div>
      <Player />
    </div>
  );
};

const RapsNav: React.FC = () =>
  <nav className="navbar navbar-dark bg-dark sticky-top">
    <a className="navbar-brand" href="#">
      <img src={logo} className='d-inline-block align-top' width="30" height="30" alt="" loading="lazy" /> BSDAPP
    </a>
    <UploadModal />
  </nav>