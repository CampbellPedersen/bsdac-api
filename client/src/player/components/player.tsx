import React, { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { useStream } from '../stream';
import { Thumbnail } from '../../raps/components/thumbnail';
import './player.scss';

export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl },
  } = useContext(AppContext);
  const stream = useStream();

  useEffect(() => {
    if (rap && !streamUrl) stream(rap.id);
  }, [ rap, stream, streamUrl ]);

  return (
    <div className='d-flex align-items-center'>
      <ReactAudioPlayer src={streamUrl} autoPlay controls />
      <div className='player-thumbnail'><Thumbnail rap={rap} /></div>
    </div>
  );
};