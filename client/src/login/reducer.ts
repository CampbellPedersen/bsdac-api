import { Action } from '../actions';

export interface LoginState {
  loggedIn: boolean,
  isLoading: boolean,
  failedMessage?: string,
}

export const loginReducer: React.Reducer<LoginState, Action> = (state, action) => {
  switch(action.type) {
    case 'LoginRequested':
      return {
        ...state,
        isLoading: true,
        failedMessage: undefined
      };
    case 'LoggedIn':
      return {
        ...state,
        loggedIn: true,
        isLoading: false
      };
    case 'LoginFailed':
      return {
        ...state,
        isLoading: false,
        failedMessage: action.reason,
      };
    default:
      return state;
  }
};