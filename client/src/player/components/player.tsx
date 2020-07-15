import React, { useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { useStream } from '../stream';
import { Thumbnail } from '../../raps/components/thumbnail';
import './player.scss';
import { LoadingOverlay } from '../../components/loading-overlay';

export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl },
  } = useContext(AppContext);
  const stream = useStream();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rap && !streamUrl) {
      setLoading(true);
      stream(rap.id);
    }
  }, [ rap, stream, streamUrl ]);

  return (
    <div className='player'>
      <ReactAudioPlayer autoPlay controls src={streamUrl} onCanPlay={() => setLoading(false)} />
      <div className='player-thumbnail'>
        <LoadingOverlay loading={loading}><Thumbnail rap={rap} /></LoadingOverlay>
      </div>
    </div>
  );
};