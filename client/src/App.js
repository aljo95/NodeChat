
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleuserChange = (e) => {
    setUsername(e.target.value);
  }
  const handlepwChange = (e) => {
    setPassword(e.target.value);
  }



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



  return (
    <div className="App">
      <h2 className='center'>Login</h2>
        <form className='center' onSubmit={handleForm}>
          <div>
            <label>Username: </label>
            <input type='text' name='username' value={username} onChange={handleuserChange}></input>
          </div>
          {
          <div>
            <label>Password: </label>
            <input type='password' name='password' value={password} onChange={handlepwChange}></input>
          </div>
        }
          <div>
            <input type='submit' value='Log in'></input>
          </div>
        </form>



      
    </div>
  );
}

export default App;
