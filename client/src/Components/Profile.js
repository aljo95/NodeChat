import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8080/api/checkAuth', {
          credentials: "include",
        })
        .then((response) => {
          return response.json().then((jsonResponse) => {
            console.log(jsonResponse);
            setUsername(jsonResponse.username)

            if (!jsonResponse.username) {
                //redirect back to home (root)
                navigate("/");
            }

          })
        })
    }, [])

    const logout = (e) => {
        fetch('http://127.0.0.1:8080/api/logout', {
            credentials: "include",
        })
        .then((response => {
            console.log("Logout response: ");
            console.log(response);
            navigate("/");
        }))
    }


  return (
    <div>
      <p>Username: {username}</p>
      <Link to='/chat'>
        <button id="register" className='btns'>
          <p>CHAT</p>
        </button>
      </Link>
      <button id="login" className='btns' onClick={logout}>
        <p>LOGOUT</p>
      </button>
    </div>
  );
}