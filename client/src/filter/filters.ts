import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap, Event } from '../raps/types';

const eventIsEqual = (a: Event) => (b: Event) => a.name === b.name && a.series === b.series;

const filters = (raps: Rap[]) => {
  const events: Event[] = [];
  const rappers: string[] = [];

  raps.map(rap => {
    if (!events.some(eventIsEqual(rap.appearedAt))) events.push(rap.appearedAt);
    if (!rappers.includes(rap.rapper)) rappers.push(rap.rapper);
  });

  return { events: events.sort((a, b) => a.series - b.series).reverse(), rappers: rappers.sort() }
}

export const useFilters = () => {
  const {
    raps: { raps }
  } = useContext(AppContext);

  if (!raps) throw new Error('Why ya showing filters if ya havent even loaded raps???')
  return filters(raps);
}

const applyFilters = (
  raps: Rap[],
  setResults: (ids: string[]) => void,
) =>
  (filters: { events: Event[], rappers: string[], hideBonus: boolean }) =>
    setResults(raps.filter(rap => {
      if (filters.hideBonus && rap.bonus) return false;
      const rapperIncluded = !filters.rappers.length || filters.rappers.includes(rap.rapper);
      const eventIncluded = !filters.events.length || filters.events.some(eventIsEqual(rap.appearedAt));
      return rapperIncluded && eventIncluded
    }).map(rap => rap.id));

export const useApplyFilters = () => {
  const {
    raps: { raps },
    actions: { filtersApplied }
  } = useContext(AppContext);

  if (!raps) return () => {};
  return applyFilters(raps, filtersApplied)
}