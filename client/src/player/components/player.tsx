import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { AppContext } from '../../context';
import { Thumbnail } from '../../raps/components/thumbnail';
import { LoadingOverlay } from '../../components/loading-overlay';
import { useContext } from 'react';
import { useStream } from '../stream';
import { usePlayNext } from '../play-next';
import { PlayerButton } from './player-button';
import './player.scss';

export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl },
    filter: { showMenu },
    actions: { filterMenuToggled }
  } = useContext(AppContext);
  const stream = useStream();
  const playNext = usePlayNext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rap && !streamUrl) {
      setLoading(true);
      stream(rap.id);
    }
  }, [ rap, stream, streamUrl ]);

  return (
    <div className='player'>
      <ReactAudioPlayer
        autoPlay
        controls
        src={streamUrl}
        onCanPlay={() => setLoading(false)}
        onEnded={playNext}/>
      <div className='button'>
        <PlayerButton onClick={filterMenuToggled}>{filterIcon(showMenu)}</PlayerButton>
      </div>
      <div className='player-thumbnail'>
        <LoadingOverlay loading={loading}><Thumbnail rap={rap} /></LoadingOverlay>
      </div>
    </div>
  );
};

const filterIcon = (isActive?: boolean) => <>
  <svg fill={isActive ? 'black' : '#A9ABAB'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.875 477.875">
    <path d="M460.804 0H17.071C7.645 0 .004 7.641.004 17.067V102.4c-.004 4.842 2.05 9.458 5.649 12.698l165.018 148.514V460.8c-.004 9.426 7.633 17.07 17.059 17.075 2.651.001 5.266-.615 7.637-1.8l102.4-51.2c5.786-2.891 9.441-8.806 9.438-15.275V263.612l165.018-148.48c3.608-3.247 5.662-7.878 5.649-12.732V17.067C477.871 7.641 470.23 0 460.804 0z"/>
  </svg>
</>

const shuffleIcon = (isActive?: boolean) => <>
  <svg fill={isActive ? 'black' : '#A9ABAB'} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M506.24 371.7l-96-80c-4.768-4-11.424-4.8-17.024-2.208A16.02 16.02 0 00384 303.988v48h-26.784c-22.208 0-42.496-11.264-54.272-30.08l-103.616-165.76c-23.52-37.664-64.096-60.16-108.544-60.16H0v64h90.784c22.208 0 42.496 11.264 54.272 30.08l103.616 165.76c23.552 37.664 64.128 60.16 108.544 60.16H384v48a16.02 16.02 0 009.216 14.496 16.232 16.232 0 006.784 1.504c3.68 0 7.328-1.248 10.24-3.712l96-80c3.68-3.04 5.76-7.552 5.76-12.288 0-4.736-2.08-9.248-5.76-12.288z" />
    <path d="M506.24 115.7l-96-80c-4.768-3.968-11.424-4.8-17.024-2.176C387.584 36.116 384 41.78 384 47.988v48h-26.784c-44.448 0-85.024 22.496-108.544 60.16l-5.792 9.28 37.728 60.384 22.336-35.744c11.776-18.816 32.064-30.08 54.272-30.08H384v48c0 6.208 3.584 11.872 9.216 14.496a16.232 16.232 0 006.784 1.504c3.68 0 7.328-1.28 10.24-3.712l96-80c3.68-3.04 5.76-7.552 5.76-12.288 0-4.736-2.08-9.248-5.76-12.288zM167.392 286.164l-22.304 35.744c-11.776 18.816-32.096 30.08-54.304 30.08H0v64h90.784c44.416 0 84.992-22.496 108.544-60.16l5.792-9.28-37.728-60.384z" />
  </svg>
</>