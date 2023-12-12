import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import socketIO from 'socket.io-client';

  const socket = socketIO.connect('http://127.0.0.1:8080');

export default function Chat() {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    
    
    useEffect(() => {

        fetch('http://127.0.0.1:8080/api/checkAuth', {
          credentials: "include",
        })
        .then((response) => {
          return response.json().then((jsonResponse) => {

            if (!jsonResponse.username) {
                //redirect back to home (root)
                navigate("/");
            } else {
              setUsername(jsonResponse.username);

              socket.on('connect', () => {
                console.log('Connected to server');
              });
          
              socket.on('disconnect', () => {
                console.log('Disconnected from server');
              });

            }

          })
        })
    }, [])



    useEffect(() => {
      socket.on('message', (message) => {
        setMessages([ ...messages, message])
      })
    }, [messages])


    const sendMessage = () => {

      //socket.emit('sendMessage', { name: nickname, text: messageText });
      socket.emit('sendMessage', { name: username, text: messageText });
      setMessageText('');
    }

    const logout = (e) => {
        //DESTROY SESSION AND SET STATE TO FALSE
        
        //THEN REDIRECT TO HOME (AKA ROOT "/")
    }






  return (
    <div className='chat-room'>

      <div className="nav-bar">
        <Link to='/profile'>
          <button id="profile" className='btns'>
            <p>PROFILE</p>
          </button>
        </Link>
        <button id="login" className='btns' onClick={logout}>
          <p>LOGOUT</p>
        </button>
      </div>


      <div className="main-content">
        <div className="users-list">
          <p id="users-online">USERS ONLINE:</p>

        </div>



        <div className="messages">
            {messages.map((message, index) => (
              <div className="nameAndMessage-container" key={index}>
                <p className="message-username">{message.name}</p>
                <p className="message-text">{message.text}</p>
              </div>
            ))}
        </div>
        

      </div>


      <div className="input-container">
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type message here..."></input>
            <button onClick={sendMessage}>SEND MSG</button>
          </div>







    </div>
  );
}