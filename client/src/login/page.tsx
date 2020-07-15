import React, { useContext, FormEvent, useState } from 'react';
import { useLogin } from './login';
import { AppContext } from '../context';
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
    <div className='login-page d-flex align-items-center justify-content-center text-center'>
      <form className="form-signin" onSubmit={submit}>
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Welcome to BSDAPP</h1>
        <label htmlFor="email" className="sr-only">Email address</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" className="form-control" placeholder="Email address" autoFocus required/>
        <label htmlFor="password" className="sr-only">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" className="form-control" placeholder="Password" required/>
        { failedMessage && <p className='text-danger'>{failedMessage}</p> }
        <button disabled={isLoading} id='login-button' type='submit' className='btn btn-primary btn-lg btn-block'>
          {isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          {isLoading ? ' Logging in...' : 'Login'}
        </button>
        <p className="mt-3 mb-3 text-muted">Made with <span role='img' aria-label='love'>❤️</span> by Campbell Pedersen</p>
      </form>
    </div>
  );
};