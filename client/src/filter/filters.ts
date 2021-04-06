import { useContext } from 'react';
import { AppContext } from '../context';
import { Rap, Event } from '../api/raps/types';

const eventIsEqual = (a: Event) => (b: Event) => a.name === b.name && a.series === b.series;

const filters = (raps: Rap[]) => {
  const events: Event[] = [];
  const rappers: string[] = [];

  raps.forEach(rap => {
    if (!events.some(eventIsEqual(rap.appearedAt))) events.push(rap.appearedAt);
    if (!rappers.includes(rap.rapper)) rappers.push(rap.rapper);
  });

  return { events, rappers: rappers.sort() }
}

export const useFilters = () => {
  const {
    raps: { data: raps }
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
    raps: { data: raps },
    actions: { filtersApplied }
  } = useContext(AppContext);

  if (!raps) return () => {};
  return applyFilters(raps, filtersApplied)
}