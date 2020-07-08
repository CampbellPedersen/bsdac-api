import React, { useContext } from 'react';
import { AppContext } from '../context';
import logo from '../images/logo.svg';
import './page.css';

export const LoginPage: React.FC = () => {
  const {
    actions: { loggedIn }
  } = useContext(AppContext);

  return (
    <div className='login-page text-center'>
      <form className="form-signin">
        <img className="mb-4" src={logo} alt="" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Welcome to BSDAPP</h1>
        <label htmlFor="email" className="sr-only">Email address</label>
        <input type="email" id="email" className="form-control" placeholder="Email address" autoFocus />
        <label htmlFor="password" className="sr-only">Password</label>
        <input type="password" id="password" className="form-control" placeholder="Password" />
        <button id='login-button' type='button' className='btn btn-primary btn-lg btn-block' onClick={() => loggedIn()} >Login</button>
        <p className="mt-3 mb-3 text-muted">Made with ❤️ by Campbell Pedersen</p>
      </form>
    </div>
  );
};