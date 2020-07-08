import { Rap } from './types';
import { Action } from '../actions';

export interface RapsState {
  loaded?: Rap[],
}

export const rapsReducer: React.Reducer<RapsState, Action> = (state, action) => {
  switch(action.type) {
    case 'RapsLoaded':
      return {
        ...state,
        loaded: action.raps
      };
    default:
      return state;
  }
};