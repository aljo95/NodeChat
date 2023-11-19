

import Home from './Components/Home';
import  Login  from './Components/Login';
import  Register  from './Components/Register';
import './App.css';
import React /*,{ Component }*/ from 'react';
import { Route, Routes } from 'react-router-dom';
//import ReactDOM from 'react-dom/client';

function App() {

  return (
    <main>
      <Routes>
        <Route path='/' Component={Home} exact />
        <Route path="/login" Component={Login} />
        <Route path='/register' Component={Register}/>
      </Routes>
    </main>
  );
}

export default App;
