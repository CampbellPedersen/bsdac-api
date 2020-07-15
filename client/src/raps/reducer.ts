import { Rap } from './types';
import { Action } from '../actions';

export interface RapsState {
  isLoading: boolean,
  raps?: Rap[]
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
        raps: action.raps
      };
    case 'RapUploaded':
      const raps = state.raps || [];
      return {
        ...state,
        raps: [...raps, action.rap ]
      }
    default:
      return state;
  }
};