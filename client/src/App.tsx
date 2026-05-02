import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppContext, useAppContext } from './context';
import { LoginPage } from './login/page';
import { RapsPage } from './raps/page';

const Content = () => {
  const {
    login: { loggedIn },
  } = useContext(AppContext);

  if (!loggedIn) {
    return <LoginPage/>;
  }

  return (
    <Routes>
      <Route path="/" element={<RapsPage />} />
      <Route path="/raps/:rapId" element={<RapsPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

const App = () => {
  const appContext = useAppContext();
  return (
    <AppContext.Provider value={appContext}>
      <Content/>
    </AppContext.Provider>
  );
};

export default App;
