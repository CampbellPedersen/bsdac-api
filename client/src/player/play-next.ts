import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap } from '../raps/types';

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
    raps: { raps, queue },
    player: { rap },
    actions: { rapSelected }
  } = useContext(AppContext);
  if (!rap || !raps || !queue) return () => {};
  const options = raps.filter((rap) => queue.includes(rap.id))
  return playNext(rap, options, rapSelected);
};