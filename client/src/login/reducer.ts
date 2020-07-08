import { Action } from '../actions';

export interface LoginState {
  loggedIn: boolean,
}

export const loginReducer: React.Reducer<LoginState, Action> = (state, action) => {
  switch(action.type) {
    case 'LoggedIn':
      return {
        ...state,
        loggedIn: true
      };
    case 'LoggedOut':
      return {
        ...state,
        loggedIn: false
      };
    default:
      return state;
  }
};