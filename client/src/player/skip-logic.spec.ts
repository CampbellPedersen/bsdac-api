import { EventName, Rap } from '../api/raps/types';
import { createSkip } from './skip-logic';

describe('skip-logic', () => {
  const rap1: Rap = { id: 'rap-001', title: 'The First Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 } };
  const rap2: Rap = { id: 'rap-002', title: 'The Second Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 2 } };
  const rap3: Rap = { id: 'rap-003', title: 'The Third Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 3 } };

  let selectedRap: Rap | undefined;
  const selectRap = (rap: Rap) => selectedRap = rap;

  beforeEach(() => {
    selectedRap = undefined;
  });

  test('when play next > should select the next rap', () => {
    const { playNext } = createSkip(rap2, [rap1, rap2, rap3], selectRap);

    playNext();

    expect(selectedRap).toEqual(rap3);
  });

  test('when play previous > should select the previous rap', () => {
    const { playPrevious } = createSkip(rap2, [rap1, rap2, rap3], selectRap);

    playPrevious();

    expect(selectedRap).toEqual(rap1);
  });

  test('when at queue boundary > should not select another rap', () => {
    const { playNext } = createSkip(rap3, [rap1, rap2, rap3], selectRap);

    playNext();

    expect(selectedRap).toBeUndefined();
  });
});
