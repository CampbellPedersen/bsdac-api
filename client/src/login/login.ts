import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../context';

export const login = (
  isLoading: boolean,
  requested: () => void,
  loggedIn: () => void,
  failed: (reason: string) => void
) => {
  const requestLogin = async (email: string, password: string): Promise<void> =>
    axios.post('/api/login', { email, password });

  return async (email: string, password: string) => {
    if (isLoading) return;

    requested();
    try {
      await requestLogin(email, password);
      localStorage.setItem('loggedIn', 'true');
      loggedIn();
    } catch (e) {
      failed('Incorrect email or password');
    }
  };
};

export const useLogin = () => {
  const {
    login: { isLoading },
    actions: { loginRequested, loggedIn, loginFailed }
  } = useContext(AppContext);

  return login(isLoading, loginRequested, loggedIn, loginFailed);
};