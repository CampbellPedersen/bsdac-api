import React, { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { useStream } from '../stream';


export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl },
  } = useContext(AppContext);
  const stream = useStream();

  useEffect(() => {
    if (rap && !streamUrl) stream(rap.id);
  }, [ rap, stream, streamUrl ]);

  return <ReactAudioPlayer src={streamUrl} autoPlay controls />;
};