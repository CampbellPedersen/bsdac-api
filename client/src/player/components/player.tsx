import React, { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useContext } from 'react';
import { AppContext } from '../../context';
import { useStreamRap } from '../stream';


export const Player: React.FC = () => {
  const {
    player: { rap, streamUrl },
  } = useContext(AppContext);
  const stream = useStreamRap();

  useEffect(() => {
    if (rap && !streamUrl) stream(rap.id);
  }, [ rap, stream, streamUrl ]);

  if (!streamUrl) return (<span>NO RAP SELECTED</span>);
  return <ReactAudioPlayer src={streamUrl} autoPlay controls />;
};