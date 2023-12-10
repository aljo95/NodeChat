import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import socketIO from 'socket.io-client';

  //const socket = socketIO.connect('http://127.0.0.1:8080');
  const socket = socketIO.connect('http://127.0.0.1:8080');
  let data = {};

export default function Chat() {

    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    let nickname = "";
    //let data = {hehe: "hoho"};

    useEffect(() => {

      /////////////////////////////////
      
//////////////////////////////

        fetch('http://127.0.0.1:8080/api/checkAuth', {
          credentials: "include",
        })
        .then((response) => {
          return response.json().then((jsonResponse) => {

            if (!jsonResponse.username) {
                //redirect back to home (root)
                navigate("/");
            } else {
              nickname = jsonResponse.username;
              
              data = {name: nickname, userId: socket.id};
              console.log(data);

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
      socket.emit('setSockedId', data);
      console.log("-----------");
      console.log(data);
      console.log("-----------");
      socket.emit('sendMessage', { text: messageText });
      setMessageText('');
    }

    const logout = (e) => {
        //DESTROY SESSION AND SET STATE TO FALSE
        
        //THEN REDIRECT TO HOME (AKA ROOT "/")
    }






  return (
    <div>


      <div>
        <h1>CHAT HERE</h1>
        <div className="messages">
          {messages.map((message, index) => (
            <div className="nameAndMessage-container" key={index}>
              <p className="message-username">{data.userId}</p>
             {/*  <p className="message-text">{message.text}</p> */}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type message here..."></input>
          <button onClick={sendMessage}>SEND MSG</button>
        </div>


      </div>











        <div id="profile-menu">     {/* These css ids are not created yet */}
            <Link to='/profile'>
                <button id="profile" className='btns'>
                    <p>PROFILE</p>
                </button>
            </Link>
        </div>


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