import { useContext, useMemo } from 'react';
import { AppContext } from '../context';
import { Rap } from '../api/raps/types';
import { useNavigateToRap } from '../raps/hooks';
import { createSkip } from './skip-logic';

export const useSkip = (rap?: Rap) => {
  const {
    raps: { data: raps, queue },
  } = useContext(AppContext);
  const selectRap = useNavigateToRap();

  return useMemo(() => {
    if (!rap || !raps || !queue) {
      return {
        playNext: () => {},
        playPrevious: () => {},
      };
    }

    const options = raps.filter((rap) => queue.includes(rap.id));
    return createSkip(rap, options, selectRap);
  }, [queue, rap, raps, selectRap]);
};
