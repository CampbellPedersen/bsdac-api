import { Action } from '../actions';
import { Rap } from '../raps/types';

export interface AudioPlayerState {
  isLoading: boolean
  isShuffling: boolean
  rap?: Rap,
  streamUrl?: string,
}

export const playerReducer: React.Reducer<AudioPlayerState, Action> = (state, action) => {
  switch(action.type) {
    case 'RapSelected':
      if (state.rap?.id === action.rap.id) return state;
      return {
        ...state,
        rap: action.rap,
        streamUrl: undefined,
      };
    case 'AudioStreamRequested':
      return {
        ...state,
        isLoading: true,
        streamUrl: undefined,
      };
    case 'AudioStreamReceived':
      return {
        ...state,
        isLoading: false,
        streamUrl: action.url,
      };
    case 'ShuffleToggled':
      return {
        ...state,
        isShuffling: action.enabled
      }
    default:
      return state;
  }
};