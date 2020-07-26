import { Rap } from './types';
import { Action } from '../actions';

export interface RapsState {
  isLoading: boolean,
  raps?: Rap[]
  queue?: string[];
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
        raps: action.raps,
        queue: action.raps.map(rap => rap.id),
      };
    case 'RapUploaded':
      const raps = state.raps || [];
      const queue = state.queue || [];
      return {
        ...state,
        raps: [...raps, action.rap ],
        queue: [ ...queue, action.rap.id ],
      }
    case 'FiltersApplied':
      return {
        ...state,
        queue: action.ids,
      }
    default:
      return state;
  }
};