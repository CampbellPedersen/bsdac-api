import { stream } from './stream';
import { Rap, EventName } from '../raps/types';
import { playNext } from './play-next';

describe('play-next', () => {
  const rap1: Rap = { id: 'rap-001', title: 'The First Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};
  const rap2: Rap = { id: 'rap-002', title: 'The Second Rap', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 2 }};

  let selectedRap: Rap | undefined;
  let select = (rap: Rap) => selectedRap = rap;

  beforeEach(() => {
    selectedRap = undefined;
  });

  test('given no options > when play next > should not select a rap', () => {
    const playNextRap = playNext(rap1, [], select);
    
    playNextRap();

    expect(selectedRap).toBeUndefined();
  });

  test('given options > when play next after final rap > should not select a rap', () => {
    const playNextRap = playNext(rap2, [ rap1, rap2 ], select);
    
    playNextRap();

    expect(selectedRap).toBeUndefined();
  });

  test('given rap played > when play next > should select next rap', () => {
    const playNextRap = playNext(rap1, [ rap1, rap2 ], select);
    
    playNextRap();

    expect(selectedRap).toEqual(rap2);
  });

});