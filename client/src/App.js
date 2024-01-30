

import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Profile from './Components/Profile';
import Chat from './Components/Chat'
import './App.css';
import React ,{ useState } from 'react';
import { Route, Routes } from 'react-router-dom';

export const UserContext = React.createContext(null);

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main>
      <UserContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn }}>
      <Routes>
          <Route path='/' Component={Home} exact />
          <Route path="/login" Component={Login} />
          <Route path='/register' Component={Register}/>
          <Route path='/profile' Component={Profile} />
          <Route path='/chat' Component={Chat} />
      </Routes>
      </UserContext.Provider>
    </main>
  );
}

export default App;
