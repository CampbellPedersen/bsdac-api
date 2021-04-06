import { Rap } from '../api/raps/types';
import { Action } from '../actions';

export interface RapsState {
  isLoading: boolean,
  data: Rap[] | null
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
        data: action.raps,
        queue: action.raps.map(rap => rap.id),
      };
    case 'RapUploaded':
      const raps = state.data || [];
      const queue = state.queue || [];
      return {
        ...state,
        data: [...raps, action.rap ],
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