import { Action } from '../actions';

export interface AudioPlayerState {
  isLoading: boolean
  rapId?: string,
  streamUrl: string | null,
}

export const playerReducer: React.Reducer<AudioPlayerState, Action> = (state, action) => {
  switch(action.type) {
    case 'AudioStreamRequested':
      return {
        ...state,
        isLoading: true,
        rapId: action.rapId,
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
