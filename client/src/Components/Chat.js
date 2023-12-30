import './App.css';
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useNavigate, Link } from "react-router-dom";
import  socketIO  from 'socket.io-client';


var socket = socketIO.connect('http://127.0.0.1:8080');

export default function Chat() {

    const [username, setUsername] = useState("");
    const [usernames, setUsernames] = useState([]);

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const [sameUserAsLastMessage, setSameUserAsLastMessage] = useState(false);
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const navigate = useNavigate();
    const ref = useRef();
    const date = new Date();
    const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    useEffect(() => {

        fetch('http://127.0.0.1:8080/api/checkAuth', {
          credentials: "include",
        })
        .then((response) => {
          return response.json().then((jsonResponse) => {

            if (!jsonResponse.username) {
                //redirect back to home (root)
                navigate("/");
                //break needed?
            } else {
              setUsername(jsonResponse.username);
              

              socket.on('connect', () => {
                console.log('Connected to server');
              });

              socket.emit('sendUsername', (jsonResponse.username));

          /*
              socket.on('disconnect', () => {
                console.log('Disconnected from server');
              });
          */
            }
            return ()=>{ 
              socket.disconnect(); 
             }
          })
        });
    }, [])

    useEffect(() => {
      ref.current.scrollIntoView();
    })


    useEffect(() => {
      
      socket.on('message', (message) => {
        //message has { message.name, message.time, message.text } as object

        console.log("öööööööööööööö");

        if (messages.length === 0) {
          console.log("FIRST ONLY?");
          setMessages([message]);
          return;
        }

        for (let i=messages.length-1; i>=0; i--) {
          console.log(i);
          if (messages[i].name) {
            if (messages[i].name !== message.name) {
              setMessages([ ...messages, message]);
              return;
            } else if (messages[i].name === message.name) {
              
              //DONT EVEN NEED THESE SOCKETS, JUST TAKE message.time AND USE ON THE messages[i].time !!
              /*
              socket.emit('getTime');
              socket.on('getTime', (time) => {
                messages[i].time = time;
                //forceUpdate();
                //setMessages([ ...messages]);
              })
              */

              messages[i].time = message.time;
              setMessages([ ...messages, message.text]);
              return;
            }
          }
        }
      })
      return () => {
        socket.off('message');
      }
    }, [messages])


    useEffect(() => {
      
      socket.on('username', (userNames) => {
        
        setUsernames(userNames);
       // forceUpdate();          //needed?
      })

    }, [usernames])

    // dont need later
    useEffect(() => {
      console.log("amount of users: " + usernames.length);
    }, [usernames])


    const sendMessage = () => {
      socket.emit('sendMessage', { name: username, text: messageText });
      setMessageText('');
    }

    const logout = () => {

      fetch('http://127.0.0.1:8080/api/logout', {
        credentials: "include",
      })
      .then((res) => {
        return res.json().then((jsonRes) => {
          console.log(jsonRes);
          
          socket.emit('removeUser', username);
          socket.on('updatedUsers', async (updatedUserArray) => {
            await setUsernames(updatedUserArray);        
          })
          

          navigate("/");
        })
      })
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
          <p id="users-online">USERS</p>
          {usernames.map((nick, index) => (
            <div key={index} className="each-user-container">

              <div className="green-orb"></div>
              <p className="username-list">{nick}</p>

            </div>
          ))}
        </div>


        <div className="messages-and-input">

          <div className="messages">
            {messages.map((message, index) => ( //need conditionals here: if (message.text) else... etc.
            <div className="nameAndMessage-container" key={index}> 
            {message.text ? 
              <>
                <div className="name-and-time">
                  <p className="message-username"><b>{message.name}</b>&nbsp;</p>
                  <p className="message-time">{message.time}</p>
                </div>
                <p className="message-text">{message.text}</p>
              </>  
              :
              <p className="message-text">{message}</p>
            }  
            </div>
            ))}
            <div ref={ref}></div>
          </div>


          <div className="input-container">
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type message here..."></input>
            <button onClick={sendMessage}>SEND MSG</button>
          </div>  

        </div>

      </div>
          {/* 
      <div className="input-container">
        <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type message here..."></input>
        <button onClick={sendMessage}>SEND MSG</button>
      </div>  
          */}
    </div>
  );
}
