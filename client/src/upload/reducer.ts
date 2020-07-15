import { Action } from '../actions';

export interface UploadState {
  progress?: number
  failedMessage?: string
}

export const uploadReducer: React.Reducer<UploadState, Action> = (state, action) => {
  switch(action.type) {
    case 'RapUploadProgressed':
      return {
        ...state,
        progress: action.progress,
        failedMessage: undefined,
      }
    case 'RapUploadFailed':
      return {
        ...state,
        progress: undefined,
        failedMessage: action.reason
      }
    case 'RapUploaded':
      return {
        ...state,
        progress: undefined,
      }
    default:
      return state;
  }
};