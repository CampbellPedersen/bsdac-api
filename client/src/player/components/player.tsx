import React from 'react';
import { AppContext } from '../../context';
import { Thumbnail } from '../../raps/components/thumbnail';
import { LoadingOverlay } from '../../components/loading-overlay';
import { useContext } from 'react';
import { useStream } from '../../api/raps/stream';
import { useSkip } from '../use-skip';
import { PlayerButton } from './player-button';
import { Rap } from '../../api/raps/types';
import { useAudioPlayback } from './use-audio-playback';
import './player.scss';

interface ViewProps {
  rap?: Rap
  streamUrl?: string
  startAtSeconds?: number
  filterMenuShown: boolean
  toggleFilterMenu: () => void
  playPrevious: () => void
  playNext: () => void
}

const PlayerView: React.FC<ViewProps> = ({
  rap,
  streamUrl,
  startAtSeconds,
  filterMenuShown,
  toggleFilterMenu,
  playPrevious,
  playNext
}) => {
  const {
    audioRef,
    handlePlaybackReady,
    handleCanPlay,
    loading
  } = useAudioPlayback(streamUrl, startAtSeconds);

  return (
    <div className='player'>
      <audio
        ref={audioRef}
        className='react-audio-player'
        autoPlay
        controls
        src={streamUrl}
        onLoadedMetadata={handlePlaybackReady}
        onCanPlay={handleCanPlay}
        onEnded={playNext}/>
      <div className='buttons'>
        <PlayerButton label='Play previous rap' onClick={playPrevious}>
          {previousIcon()}
        </PlayerButton>
        <PlayerButton label='Play next rap' onClick={playNext}>
          {nextIcon()}
        </PlayerButton>
        <PlayerButton
          label='Toggle filters'
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

const nextIcon = () => <>
  <svg fill='black' xmlns="http://www.w3.org/2000/svg" viewBox="120 96 296 320">
    <path d="M384 96c-17.7 0-32 14.3-32 32v96.4L169 102.3c-21.3-14.2-49 1.1-49 26.7v254c0 25.6 27.7 40.9 49 26.7L352 287.6V384c0 17.7 14.3 32 32 32s32-14.3 32-32V128c0-17.7-14.3-32-32-32z"/>
  </svg>
</>;

const previousIcon = () => <>
  <svg fill='black' xmlns="http://www.w3.org/2000/svg" viewBox="96 96 296 320">
    <path d="M128 96c17.7 0 32 14.3 32 32v96.4L343 102.3c21.3-14.2 49 1.1 49 26.7v254c0 25.6-27.7 40.9-49 26.7L160 287.6V384c0 17.7-14.3 32-32 32s-32-14.3-32-32V128c0-17.7 14.3-32 32-32z"/>
  </svg>
</>;

export const Player: React.FC<{ rap?: Rap, startAtSeconds?: number }> = ({ rap, startAtSeconds }) => {
  const {
    filter: { showMenu },
    actions: { filterMenuToggled }
  } = useContext(AppContext);

  const streamData = useStream(rap?.id);
  const filterMenuShown = showMenu;
  const toggleFilterMenu = filterMenuToggled;
  const { playPrevious, playNext } = useSkip(rap);

  if (streamData.state === 'loading') {
    return <PlayerView
      rap={rap}
      startAtSeconds={startAtSeconds}
      filterMenuShown={filterMenuShown}
      toggleFilterMenu={toggleFilterMenu}
      playPrevious={playPrevious}
      playNext={playNext}
    />;
  }

  const { data: streamUrl } = streamData;
  return <PlayerView
    rap={rap}
    streamUrl={streamUrl}
    startAtSeconds={startAtSeconds}
    filterMenuShown={filterMenuShown}
    toggleFilterMenu={toggleFilterMenu}
    playPrevious={playPrevious}
    playNext={playNext}
  />;
};
