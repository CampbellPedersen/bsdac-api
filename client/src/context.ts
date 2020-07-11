import { createContext, Reducer, useReducer } from 'react';
import { RapsState, rapsReducer } from './raps/reducer';
import { Action, Actions } from './actions';
import { loginReducer, LoginState } from './login/reducer';

interface AppContextType {
  login: LoginState
  raps: RapsState
  actions: Actions
}

interface AppState {
  login: LoginState
  raps: RapsState
}

const reducer: Reducer<AppState, Action> = (state, action) => {
  return {
    login: loginReducer(state.login, action),
    raps: rapsReducer(state.raps, action),
  };
};

export const useAppContext = () => {
  const initialState = {
    login: { loggedIn: false, isLoading: false },
    raps: { isLoading: false }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = new Actions(dispatch);
  return { ...state, actions };
};

export const AppContext = createContext<AppContextType>({} as AppContextType);
