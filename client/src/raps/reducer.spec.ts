import { RapsState, rapsReducer } from './reducer';
import { EventName, Rap } from '../api/raps/types';

describe('reducer', () => {
  const rap: Rap = { id: 'rap-001', title: 'The First Rap', lyrics: 'Words mun', bonus: false, rapper: 'Campbell Pedersen', imageUrl: 'imageUrl', appearedAt: { name: EventName.BSDAC, series: 1 }};

  test('when raps requested > should return loading state', () => {
    const state: RapsState = { data: [], isLoading: false };
    const newState = rapsReducer(state, { type: 'RapsRequested' });

    expect(newState).toEqual({ raps: [], isLoading: true });
  });

  test('given no raps > when raps loaded > should return state with loaded raps', () => {
    const state: RapsState = { data: [], isLoading: true };
    const newState = rapsReducer(state, { type: 'RapsLoaded', raps: [ rap ] });

    expect(newState).toEqual({ raps: [ rap ], queue: [ rap.id ], isLoading: false });
  });

  test('given raps > when raps loaded > should return state with newly loaded raps', () => {
    const state: RapsState = { data: [ rap ], isLoading: true };
    const newState = rapsReducer(state, { type: 'RapsLoaded', raps: [ rap, rap ] });

    expect(newState).toEqual({ raps: [ rap, rap ], queue: [ rap.id, rap.id ], isLoading: false });
  });

  test('given raps > when rap uploaded > should return state with new rap', () => {
    const state: RapsState = { data: [ ], isLoading: false };
    const newState = rapsReducer(state, { type: 'RapUploaded', rap });

    expect(newState).toEqual({ raps: [ rap ], queue: [ rap.id ], isLoading: false });
  });
});