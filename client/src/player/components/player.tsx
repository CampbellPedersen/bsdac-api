import React, { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { useStreamRap } from '../../raps/stream';


export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl },
  } = useContext(AppContext);
  const stream = useStreamRap();

  useEffect(() => {
    if (rap) stream(rap.id);
  }, [ rap, stream ]);

  return <ReactAudioPlayer src={streamUrl} autoPlay />;
};