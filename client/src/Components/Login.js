import './App.css';
//import axios from 'axios';
import React, { useState, redirect, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [passPortLogin, setPassPortLogin] = useState(false);

  const handleuserChange = (e) => {
    setUsername(e.target.value);
  }
  const handlepwChange = (e) => {
    setPassword(e.target.value);
  }

  const navigate = useNavigate();

/*
  const handleForm = async (e) => {
    
    console.log(username);
    e.preventDefault();
    
    const userData = {
      username: username,
      password: password,
    };

    try {
      const add = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log(add);
    } catch(err) {
      console.error();
    }
  };
*/

useEffect(() => {
  fetch('http://localhost:8080/api/checkAuth', {
    method: 'GET',
    hedaers: {
      'Content-Type': 'Application/json'
    },
    
  })
  .then(res => {
    console.log("IN FETCH GET: ");
    console.log(res) 
    console.log("AFTER FETCH GET: ");
  });



}, []);

const handleForm = async (e) => {
    
    console.log(username);
    e.preventDefault();
    
    const userData = {
      username: username,
      password: password,
    };

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(res => {
        console.log(res);
        if (res.ok) {
          alert("GOOD JOB XD");
          setLoggedIn(true);
        } else {
          alert("WRONG INFO!");
        }
        
      })
    
  };

  const handleClick = () => {
    navigate("/");
  }

  return (
    <div>
      <div className="register">
        <h2 id='register-welcome'><p>Login</p></h2>
          <form className='register-form' onSubmit={handleForm}>
            
              <label>Username: </label>
              <input className='inputs' type='text' name='username' value={username} onChange={handleuserChange}></input>
          
              <label>Password: </label>
              <input className='inputs' type='password' name='password' value={password} onChange={handlepwChange}></input>
            
              <input id='reg-btn' className='btns' type='submit' value='Log in'></input>

          </form>
          <button onClick={handleClick} type="button" />
      </div>
  </div>
  );
}
/*
export default Login;*/