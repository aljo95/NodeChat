import './App.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import  Login  from './Components/Login';
//import  Register  from './Components/TestRoute';

export default function Home() {

  return (
    <div className="home">
      <h2 id='welcome'>Welcome</h2>

      <button id="login" className=''>
        <Link to='/login'> Login </Link>
      </button>

      <button id="register" className=''>
        <Link to='/register' className=''> Register </Link>
      </button>

      
    </div>
  );
}