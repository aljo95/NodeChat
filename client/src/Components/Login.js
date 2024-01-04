import './App.css';
//import axios from 'axios';
import { UserContext } from '../App.js';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, redirect } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  

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
/*
useEffect(() => {
  //fetch('http://localhost:8080/api/checkAuth', {
  fetch('http://127.0.0.1:8080/api/checkAuth', {
    method: 'POST',
    //credentials: "include",
    headers: {
      'Content-Type': 'Application/json',

    },
    
  })
  .then(res => {
    console.log("IN FETCH GET: ");
    console.log(res) 
    console.log("AFTER FETCH GET: ");
  });



}, []);
*/
useEffect(() => {



  //fetch('http://127.0.0.1:8080/api/checkAuth', {
  fetch('/api/checkAuth', {
    method: 'GET',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
  })
  /*
  .then((response) => response.json()).then((data) => {
    console.log("HEHEHEIAHRIEAHRIARHOEIAHRA");
    console.log(data);
  });
  */
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
//  export default Login;