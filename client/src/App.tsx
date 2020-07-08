import React, { useContext } from 'react';
import { AppContext, useAppContext } from './context';
import { LoginPage } from './login/page';
import { RapsPage } from './raps/page';

const Layout: React.FC = ({ children }) =>
  <div className='container'>
    {children}
  </div>;


const Content = () => {
  const {
    login: { loggedIn }
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
      <Layout>
        <Content/>
      </Layout>
    </AppContext.Provider>
  );
};

export default App;
