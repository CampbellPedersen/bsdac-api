import React, { useContext, FormEvent, useState } from 'react';
import { useLogin } from './login';
import { AppContext } from '../context';
import { Spinner } from '../components/spinner';
import logo from '../images/logo.svg';
import './page.scss';

export const LoginPage: React.FC = () => {
  const {
    login: { isLoading, failedMessage },
  } = useContext(AppContext);
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className='login-page'>
      <img src={logo} alt="" width="72" height="72" />
      <h1>Welcome to BSDAPP</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="form-control" placeholder="Email address" autoFocus required/>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="form-control" placeholder="Password" required/>
        { failedMessage && <p className='text-danger'>{failedMessage}</p> }
        <button disabled={isLoading} id='login-button' type='submit' className='btn btn-primary btn-lg btn-block'>
          {isLoading && <Spinner small />}
          {isLoading ? ' Logging in...' : 'Login'}
        </button>
      </form>
      <p>Made with <span role='img' aria-label='love'>❤️</span> by Campbell Pedersen</p>
    </div>
  );
};