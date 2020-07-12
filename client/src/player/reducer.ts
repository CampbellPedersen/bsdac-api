import { Action } from '../actions';
import { Rap } from '../raps/types';

export interface AudioPlayerState {
  rap?: Rap,
  streamUrl?: string,
}

export const playerReducer: React.Reducer<AudioPlayerState, Action> = (state, action) => {
  switch(action.type) {
    case 'RapSelected':
      return {
        ...state,
        rap: action.rap,
        streamUrl: undefined,
      };
    case 'AudioStreamRequested':
      return {
        ...state,
        streamUrl: undefined,
      };
    case 'AudioStreamReceived':
      return {
        ...state,
        streamUrl: action.url,
      };
    default:
      return state;
  }
};