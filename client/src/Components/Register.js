import './App.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleuserChange = (e) => {
    setUsername(e.target.value);
  }
  const handlepwChange = (e) => {
    setPassword(e.target.value);
  }

const handleForm = (e) => {
    
    console.log(username);
    e.preventDefault();
    
    const userData = {
      username: username,
      password: password,
    };
     //fetch('http://localhost:8080/api/register', {
      fetch('/api/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        //this is for registering, we want to redirect on login
        if (data.message === "success") {
          //
        }

      });
  };
  const handleClick = () => {
    navigate("/");
  }

  return (
  <>
    <div className="register">
      <h2 id='register-welcome'><p>Register Account</p></h2>
        <form className='register-form' onSubmit={handleForm}>

            <label>Username</label>
            <input className='inputs' type='text' name='username' value={username} onChange={handleuserChange}></input>

            <label>Password</label>
            <input className='inputs' type='password' name='password' value={password} onChange={handlepwChange}></input>

            <div className="form-btns-container">
              <input id='reg-btn' className='btns' type='submit' value='Register'></input>
              <button id="back-btn" className="btns" onClick={handleClick} type="button">Back</button>
            </div>
        </form>
    </div>
  </>
  );
}