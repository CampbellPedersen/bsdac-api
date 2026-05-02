import React from 'react';
import { RapList } from './components/list';
import { LoadingScreen } from '../components';
import { Player } from '../player/components/player';
import { UploadModal } from '../upload/components/modal';
import { FilterMenu } from '../filter/components/filter-menu';
import { Column, Row } from '../components/grid';
import logo from '../images/logo.svg';
import { useRaps } from '../api/raps/load';
import { useNavigateToRap, useSelectedRapFromRoute, useVisibleRaps } from './hooks';
import './page.scss';

export const RapsPage: React.FC = () => {
  const rapData = useRaps();
  const loadedRaps = rapData.state === 'loaded' ? rapData.data : [];
  const selectRap = useNavigateToRap();
  const visibleRaps = useVisibleRaps(loadedRaps);
  const { selectedRap, startAtSeconds } = useSelectedRapFromRoute(loadedRaps);

  if (rapData.state === 'loading') {
    return <LoadingScreen />;
  };

  return (
    <div className='raps-page'>
      <RapsNav />
      <div className='raps-list'>
        <Row>
          <Column/>
          <Column xs={12} lg={8}>
            <RapList raps={visibleRaps} selectedRapId={selectedRap?.id} onSelect={selectRap}/>
          </Column>
          <Column/>
        </Row>
      </div>
      <FilterMenu />
      <div className='raps-player'>
        <Player rap={selectedRap} startAtSeconds={startAtSeconds} />
      </div>
    </div>
  );
};

const RapsNav: React.FC = () =>
  <nav className="navbar navbar-dark bg-dark">
    <a className="navbar-brand" href="/">
      <img src={logo} className='d-inline-block align-top' width="30" height="30" alt="" loading="lazy" /> BSDAPP
    </a>
    <UploadModal />
  </nav>;
