import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { useStream } from '../stream';
import { Thumbnail } from '../../raps/components/thumbnail';
import { LoadingOverlay } from '../../components/loading-overlay';
import { ShuffleButton } from './shuffle-button';
import { usePlayNext } from '../play-next';
import './player.scss';

export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl, isShuffling },
    actions: { shuffleToggled }
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
      {/* <div className='shuffle'>
        <ShuffleButton active={isShuffling} onClick={() => shuffleToggled(!isShuffling)} />
      </div> */}
      <div className='player-thumbnail'>
        <LoadingOverlay loading={loading}><Thumbnail rap={rap} /></LoadingOverlay>
      </div>
    </div>
  );
};