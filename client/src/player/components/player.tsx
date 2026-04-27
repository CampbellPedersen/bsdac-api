import React, { useState } from 'react';
import { AppContext } from '../../context';
import { Thumbnail } from '../../raps/components/thumbnail';
import { LoadingOverlay } from '../../components/loading-overlay';
import { useContext } from 'react';
import { useStream } from '../../api/raps/stream';
import { usePlayNext } from '../play-next';
import { PlayerButton } from './player-button';
import { Rap } from '../../api/raps/types';
import './player.scss';

interface ViewProps {
  rap?: Rap
  streamUrl?: string
  filterMenuShown: boolean
  toggleFilterMenu: () => void
  playNext: () => void
}

const PlayerView: React.FC<ViewProps> = ({
  rap,
  streamUrl,
  filterMenuShown,
  toggleFilterMenu,
  playNext
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className='player'>
      <audio
        className='react-audio-player'
        autoPlay
        controls
        src={streamUrl}
        onCanPlay={() => setLoading(false)}
        onEnded={playNext}/>
      <div className='button'>
        <PlayerButton
          onClick={toggleFilterMenu}
          focus={filterMenuShown}
        >
          {filterIcon()}
        </PlayerButton>
      </div>
      <div className='player-thumbnail'>
        <LoadingOverlay loading={loading}>
          <Thumbnail rap={rap} />
        </LoadingOverlay>
      </div>
    </div>
  );
};

const filterIcon = () => <>
  <svg fill='black' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.875 477.875">
    <path d="M460.804 0H17.071C7.645 0 .004 7.641.004 17.067V102.4c-.004 4.842 2.05 9.458 5.649 12.698l165.018 148.514V460.8c-.004 9.426 7.633 17.07 17.059 17.075 2.651.001 5.266-.615 7.637-1.8l102.4-51.2c5.786-2.891 9.441-8.806 9.438-15.275V263.612l165.018-148.48c3.608-3.247 5.662-7.878 5.649-12.732V17.067C477.871 7.641 470.23 0 460.804 0z"/>
  </svg>
</>;

export const Player: React.FC = () => {
  const {
    player: { rap },
    filter: { showMenu },
    actions: { filterMenuToggled }
  } = useContext(AppContext);

  const streamData = useStream(rap?.id);
  const filterMenuShown = showMenu;
  const toggleFilterMenu = filterMenuToggled;
  const playNext = usePlayNext();

  // Show loading player if stream url is loading
  if (streamData.state === 'loading') {
    return <PlayerView
      rap={rap}
      filterMenuShown={filterMenuShown}
      toggleFilterMenu={toggleFilterMenu}
      playNext={playNext}
    />;
  }

  // Show normal player if stream url is not loading
  const {data: streamurl} = streamData;
  return <PlayerView
    rap={rap}
    streamUrl={streamurl}
    filterMenuShown={filterMenuShown}
    toggleFilterMenu={filterMenuToggled}
    playNext={playNext}
  />;
};
