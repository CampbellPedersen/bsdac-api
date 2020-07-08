import { RapsState, rapsReducer } from './reducer';
import { EventName, Rap } from './types';

describe('reducer', () => {
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};

  it('given no raps > when raps loaded > should return state with loaded raps', () => {
    const state: RapsState = { loaded: []};
    const newState = rapsReducer(state, { type: 'RapsLoaded', raps: [ rap ] });

    expect(newState).toEqual({ raps: [ rap ] });
  });

  it('given raps > when raps loaded > should return state with newly loaded raps', () => {
    const state: RapsState = { loaded: [ rap ]};
    const newState = rapsReducer(state, { type: 'RapsLoaded', raps: [ rap, rap ] });

    expect(newState).toEqual({ raps: [ rap, rap ] });
  });
});