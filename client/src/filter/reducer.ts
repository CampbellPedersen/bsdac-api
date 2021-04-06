import { Action } from '../actions';

export interface FilterState {
  showMenu: boolean
}

export const filterReducer: React.Reducer<FilterState, Action> = (state, action) => {
  switch(action.type) {
    case 'FilterMenuToggled':
      return {
        ...state,
        showMenu: !state.showMenu
      };
    default:
      return state;
  }
};