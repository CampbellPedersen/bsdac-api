import React, { useContext, useEffect } from 'react';
import { RapList } from './components/list';
import { LoadingScreen } from '../components';
import { AppContext } from '../context';
import { Player } from '../player/components/player';
import { UploadModal } from '../upload/components/modal';
import { FilterMenu } from '../filter/components/filter-menu';
import { useLoadRaps } from './load';
import logo from '../images/logo.svg'
import './page.scss';
import { Column, Row } from '../components/grid';

export const RapsPage: React.FC = () => {
  const {
    raps: { isLoading, raps: loaded, queue },
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
      <div className='raps-list'>
        <Row>
          <Column/>
          <Column xs={12} lg={8}>
            <RapList raps={loaded.filter(rap => queue?.includes(rap.id))} onSelect={rapSelected}/>
          </Column>
          <Column/>
        </Row>
      </div>
      <FilterMenu />
      <div className='raps-player'>
        <Player />
      </div>
    </div>
  );
};

const RapsNav: React.FC = () =>
  <nav className="navbar navbar-dark bg-dark">
    <a className="navbar-brand" href="#">
      <img src={logo} className='d-inline-block align-top' width="30" height="30" alt="" loading="lazy" /> BSDAPP
    </a>
    <UploadModal />
  </nav>