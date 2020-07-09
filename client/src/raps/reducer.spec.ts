import { RapsState, rapsReducer } from './reducer';
import { EventName, Rap } from './types';

describe('reducer', () => {
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};

  it('when raps requested > should return loading state', () => {
    const state: RapsState = { loaded: [], isLoading: false };
    const newState = rapsReducer(state, { type: 'RapsRequested' });

    expect(newState).toEqual({ loaded: [], isLoading: true });
  });

  it('given no raps > when raps loaded > should return state with loaded raps', () => {
    const state: RapsState = { loaded: [], isLoading: true };
    const newState = rapsReducer(state, { type: 'RapsLoaded', raps: [ rap ] });

    expect(newState).toEqual({ loaded: [ rap ], isLoading: false });
  });

  it('given raps > when raps loaded > should return state with newly loaded raps', () => {
    const state: RapsState = { loaded: [ rap ], isLoading: true };
    const newState = rapsReducer(state, { type: 'RapsLoaded', raps: [ rap, rap ] });

    expect(newState).toEqual({ loaded: [ rap, rap ], isLoading: false });
  });
});