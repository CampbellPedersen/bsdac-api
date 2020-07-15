import React, { useContext, useEffect } from 'react';
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

  return <RapsPage />;
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
