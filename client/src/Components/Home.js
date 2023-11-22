import './App.css';
import React  from 'react';
import { Link } from 'react-router-dom';
//import  Login  from './Components/Login';
//import  Register  from './Components/TestRoute';

export default function Home() {



  return (
    <div className="home">
      <h2 id='welcome'><p>NodeChat</p></h2>

      <Link to='/login'>
        <button id="login" className='btns'>
          <p>LOGIN</p>
        </button>
      </Link>

      <Link to='/register'>
        <button id="register" className='btns'>
          <p>REGISTER</p>
        </button>
      </Link>

      
    </div>
  );
}