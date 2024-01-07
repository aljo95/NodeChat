import './App.css';
import { UserContext } from '../App.js';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  

  const handleuserChange = (e) => {
    setUsername(e.target.value);
  }
  const handlepwChange = (e) => {
    setPassword(e.target.value);
  }

  const navigate = useNavigate();

useEffect(() => {
  //fetch('http://127.0.0.1:8080/api/checkAuth', {
  fetch('/api/checkAuth', {
    method: 'GET',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((response) => {
    return response.json().then((jsonResponse) => {
      console.log("IN FRONTEND :)")
      console.log(jsonResponse);
      console.log(jsonResponse.username);
      console.log("End of fetch :)")
      if (jsonResponse.username) {
        setIsLoggedIn(true);
        navigate("/Profile");
      }
    })
  })
}, [])

const handleForm = async (e) => {
    
    console.log(username);
    e.preventDefault();
    
    const userData = {
      username: username,
      password: password,
    };

    //fetch('http://127.0.0.1:8080/api/login', {
    fetch('/api/login', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(res => {
        console.log(res);
        if (res.ok) {
          alert("GOOD JOB XD");
          setIsLoggedIn(true);

          navigate("/Profile");

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
        <h2 id='register-welcome'><p>Sign in</p></h2>
          <form className='register-form' onSubmit={handleForm}>
            
              <label>Username: </label>
              <input className='inputs' type='text' name='username' value={username} onChange={handleuserChange}></input>
          
              <label>Password: </label>
              <input className='inputs' type='password' name='password' value={password} onChange={handlepwChange}></input>
            
              <div className="form-btns-container">
                <input id='reg-btn' className='btns' type='submit' value='Log in'></input>
                <button id="back-btn" className="btns" onClick={handleClick} type="button">Back</button>
              </div>
          </form>
          
      </div>
  </div>
  );
}
