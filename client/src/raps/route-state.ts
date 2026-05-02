import { Rap } from '../api/raps/types';

export const parseStartAtSeconds = (search: string): number | undefined => {
  const t = new URLSearchParams(search).get('t');

  if (!t) return undefined;

  const seconds = Number(t);
  return Number.isFinite(seconds) && seconds >= 0
    ? seconds
    : undefined;
};

export const getSelectedRapRouteState = (
  raps: Rap[],
  rapId: string | undefined,
  search: string,
) => ({
  selectedRap: raps.find(({ id }) => id === rapId),
  startAtSeconds: parseStartAtSeconds(search),
});
