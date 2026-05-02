import { EventName, Rap } from '../api/raps/types';
import { getSelectedRapRouteState, parseStartAtSeconds } from './route-state';

describe('route-state', () => {
  const rap1: Rap = { id: 'rap-001', title: 'The First Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 } };
  const rap2: Rap = { id: 'rap-002', title: 'The Second Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 2 } };

  test('given valid t query > should parse start time', () => {
    expect(parseStartAtSeconds('?t=37')).toEqual(37);
  });

  test('given invalid t query > should ignore start time', () => {
    expect(parseStartAtSeconds('?t=abc')).toBeUndefined();
    expect(parseStartAtSeconds('?t=-5')).toBeUndefined();
  });

  test('given route state > should derive selected rap and start time', () => {
    expect(getSelectedRapRouteState([rap1, rap2], 'rap-002', '?t=45')).toEqual({
      selectedRap: rap2,
      startAtSeconds: 45,
    });
  });
});
