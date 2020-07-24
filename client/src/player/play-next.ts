import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from '../raps/types';
import { randomElement } from '../utils/array';

export const playNext = (
  current: Rap,
  options: Rap[],
  selectRap: (rap: Rap) => void,
) => {

  return () => {
    const currentIndex = options.findIndex(rap => rap.id === current.id);
    const selection = options[currentIndex + 1]
    if (selection) selectRap(selection);
  };
}


export const usePlayNext = () => {
  const {
    raps: { raps },
    player: { rap },
    actions: { rapSelected }
  } = useContext(AppContext);
  if (!rap || !raps) return () => {};
  return playNext(rap, raps, rapSelected);
};