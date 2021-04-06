import { Action } from '../actions';
import { Rap } from '../api/raps/types';

export interface AudioPlayerState {
  isLoading: boolean
  rap?: Rap,
  streamUrl: string | null,
}

export const playerReducer: React.Reducer<AudioPlayerState, Action> = (state, action) => {
  switch(action.type) {
    case 'RapSelected':
      if (state.rap?.id === action.rap.id) return state;
      return {
        ...state,
        rap: action.rap,
      };
    case 'AudioStreamRequested':
      return {
        ...state,
        isLoading: true,
        streamUrl: null,
      };
    case 'AudioStreamReceived':
      return {
        ...state,
        isLoading: false,
        streamUrl: action.url,
      };
    default:
      return state;
  }
};