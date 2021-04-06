import { createContext, Reducer, useReducer } from 'react';
import { RapsState, rapsReducer } from './raps/reducer';
import { Action, Actions } from './actions';
import { loginReducer, LoginState } from './login/reducer';
import { AudioPlayerState, playerReducer } from './player/reducer';
import { UploadState, uploadReducer } from './upload/reducer';
import { OneDay } from './utils/time';
import { FilterState, filterReducer } from './filter/reducer';

interface AppContextType {
  login: LoginState
  raps: RapsState
  player: AudioPlayerState
  filter: FilterState
  upload: UploadState
  actions: Actions
}

interface AppState {
  login: LoginState
  raps: RapsState
  player: AudioPlayerState
  filter: FilterState
  upload: UploadState
}

const reducer: Reducer<AppState, Action> = (state, action) => {
  return {
    login: loginReducer(state.login, action),
    raps: rapsReducer(state.raps, action),
    player: playerReducer(state.player, action),
    filter: filterReducer(state.filter, action),
    upload: uploadReducer(state.upload, action),
  };
};

export const useAppContext = (): AppContextType => {
  const loggedInAt = localStorage.getItem('loggedInAt')
  const loggedIn = loggedInAt ? new Date(loggedInAt).getTime() > new Date().getTime() - OneDay : false
  const initialState: AppState = {
    login: { isLoading: false , loggedIn },
    raps: { isLoading: false, data: null },
    player: { isLoading: false, streamUrl: null },
    filter: { showMenu: false },
    upload: { },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = new Actions(dispatch);
  return { ...state, actions };
};

export const AppContext = createContext<AppContextType>({} as AppContextType);