import { useEffect, useRef } from 'react';
import { scrollSelectedRapIntoView } from './selected-rap-scroll';

export const useSelectedRapScroll = (selectedRapId?: string) => {
  const selectedRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    scrollSelectedRapIntoView(selectedRef);
  }, [selectedRapId]);

  return selectedRef;
};
