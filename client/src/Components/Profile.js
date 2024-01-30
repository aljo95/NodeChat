import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function Profile() {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      fetch('/api/checkAuth', {
        credentials: "include",
      })
      .then((response) => {
        return response.json().then((jsonResponse) => {
          setUsername(jsonResponse.username)
          if (!jsonResponse.username) {
              navigate("/");
          }
        })
      })
    }, [])

    const logout = (e) => {
      fetch('/api/logout', {
        credentials: "include",
      })
      .then((res) => {
        return res.json().then((jsonRes) => {
          //console.log(jsonRes);
          navigate("/");
        })
      })
    }

  return (
    <div id="profile-container">
      <h2 id='welcome'><p>Welcome {username}!</p></h2>
      <div id="home-links">
        <button id="profile-chat" onClick={() => navigate("/chat")}>
          <p>Lobby</p>
        </button>
        <button id="rooms-chat">
          <div className="tooltiptext-profile">Coming soon!</div>
          Rooms
        </button>
        <button id="profile-logout" onClick={logout}>
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
}
