import { Rap } from './types';
import { Action } from '../actions';

export interface RapsState {
  isLoading: boolean,
  loaded?: Rap[]
}

export const rapsReducer: React.Reducer<RapsState, Action> = (state, action) => {
  switch(action.type) {
    case 'RapsRequested':
      return {
        ...state,
        isLoading: true,
      };
    case 'RapsLoaded':
      return {
        ...state,
        isLoading: false,
        loaded: action.raps
      };
    default:
      return state;
  }
};