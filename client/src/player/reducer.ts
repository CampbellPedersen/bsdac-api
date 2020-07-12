import { Action } from '../actions';

export interface AudioPlayerState {
  isLoading: boolean,
  streamUrl?: string,
}

export const playerReducer: React.Reducer<AudioPlayerState, Action> = (state, action) => {
  switch(action.type) {
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
    default:
      return state;
  }
};