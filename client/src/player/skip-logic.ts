import { Rap } from '../api/raps/types';

const playAdjacent = (
  current: Rap,
  options: Rap[],
  selectRap: (rap: Rap) => void,
  step: number,
) => {
  return () => {
    const currentIndex = options.findIndex(rap => rap.id === current.id);
    const selection = options[currentIndex + step];
    if (selection) selectRap(selection);
  };
};

export const createSkip = (
  current: Rap,
  options: Rap[],
  selectRap: (rap: Rap) => void,
) => {
  return {
    playNext: playAdjacent(current, options, selectRap, 1),
    playPrevious: playAdjacent(current, options, selectRap, -1),
  };
};
