import React, { useContext, useState } from 'react';
import { useLogin } from '../api/login/login';
import { AppContext } from '../context';
import { Spinner } from '../components/spinner';
import { Credits } from './credits';
import { Form, TextField } from '../components/forms';
import { Button } from '../components/button';
import logo from '../images/logo.svg';
import './page.scss';

export const LoginPage: React.FC = () => {
  const {
    login: { isLoading, failedMessage },
  } = useContext(AppContext);
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    await login(email, password);
  };

  return (
    <div className='login-page'>
      <img src={logo} alt="BSDAC logo" width="72" height="72" />
      <h1>Welcome to BSDAPP</h1>
      <Form className='login-form' onSubmit={submit}>
        <TextField value={email} onChange={setEmail} type="email" id="email" placeholder="Email address" autoFocus required/>
        <TextField value={password} onChange={setPassword} type="password" id="password" placeholder="Password" required/>
        {failedMessage && <p className='text-danger'>{failedMessage}</p>}
        <Button className='login-button' btn='primary' size='lg' type='submit' disabled={isLoading}>
          {
            isLoading ?
              <><Spinner small /> Logging in...</>
              : <>Login</>
          }
        </Button>
      </Form>
      <Credits />
    </div>
  );
};