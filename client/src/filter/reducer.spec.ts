import { FilterState, filterReducer } from './reducer';

describe('reducer', () => {

  test('when filter menu toggled > should return state with show menu', () => {
    const state: FilterState = { };
    const newState = filterReducer(state, { type: 'FilterMenuToggled' });

    expect(newState).toEqual({ showMenu: true });
  });

  test('given menu shown > when filter menu toggled > should return state with no shown menu', () => {
    const state: FilterState = { showMenu: true };
    const newState = filterReducer(state, { type: 'FilterMenuToggled' });

    expect(newState).toEqual({ showMenu: false });
  });
});