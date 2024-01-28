import './App.css';
import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useNavigate, Link } from "react-router-dom";
import  socketIO  from 'socket.io-client';


var socket = socketIO.connect('http://127.0.0.1:8080');
var msgHistoryArr = [];

export default function Chat() {

    const [username, setUsername] = useState("");
    const [usernames, setUsernames] = useState([]);

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const [showCollapsible, setShowCollapsible] = useState(false);

    const [lastMessage, setLastMessage] = useState({});
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const navigate = useNavigate();
    const ref = useRef();

    
    useEffect(() => {

        fetch('/api/checkAuth', {
          credentials: "include",
          method: 'GET',
        })
        .then((response) => {
          return response.json().then((jsonResponse) => {
            if (!jsonResponse.username) {
                navigate("/");
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
              // On component dismount
              socket.disconnect(); 
             }
          })
        });
        fetchHistory();
    }, [])


    const fetchHistory = () => {
      
      fetch('/api/getHistory', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setMessages([ ...data ]);
      });
    }


    useEffect(() => {
      ref.current.scrollIntoView();
      //move this ref into useEffect for [messages]?
    })


    useEffect(() => {
      socket.on('message', (message) => {
        //message has { message.name, message.time, message.text } as object
        if (messages.length === 0) {
          setLastMessage(message);
          setMessages([message]);
        } else {
          for (let i=messages.length-1; i>=0; i--) {
            if (messages[i].name) {
              if (messages[i].name !== message.name) {
                setLastMessage(message);
                setMessages([ ...messages, message]);
                break;
              } else if (messages[i].name === message.name) {
                messages[i].time = message.time;
                setLastMessage(message.text);
                setMessages([ ...messages, message.text]);
                break;
              }
            }
          }
        }
      })
      return () => {    
        socket.off('message');
      }
    }, [messages]);


    useEffect(() => {
      if (Object.keys(lastMessage).length === 0) return;
      msgHistoryArr.push(lastMessage);
    }, [lastMessage])


    const sendHistoryToDb = async () => {

      const msgObj = {
        message: msgHistoryArr[msgHistoryArr.length-1],
      }
      await fetch('/api/storeMessage', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(msgObj)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
    }


    useEffect(() => {
      socket.on('username', (userNames) => {
        setUsernames(userNames);
      })
      return () => {
        socket.off('username');
      }
    }, [usernames]);


    const sendMessage = async () => {
      if (messageText) {
        await socket.emit('sendMessage', { name: username, text: messageText });
        setMessageText('');
        setTimeout(() => {
          sendHistoryToDb();
        }, 100);
      }
    };


    const logout = () => {
      fetch('/api/logout', {
        credentials: "include",
      })
      .then((res) => {
        return res.json().then((jsonRes) => {
          socket.emit('removeUser', username);
          navigate("/");
          return;
        })
      })
    };


    const navigateToProfile = () => {
      socket.emit('removeUser', username);
      return;
    }


  return (
    <div className='chat-room'>

      <div className="main-content">
      {/* For mobiles */}
        <div className="mobile-nav-bar">
          <button id="mobile-collapsible" onClick={() => setShowCollapsible(!showCollapsible)}>Users</button>
          {showCollapsible ? 
            <div className="mobile-users-list">
              <p id="mobile-users-online">USERS</p>
              {usernames.map((nick, index) => (
                <div key={index} className="mobile-each-user-container">
                  <div className="green-orb" id="m-green-orb"></div>
                  <p className="mobile-username-list">{nick}</p>
                </div>
              ))}
            </div>
          :
            <></>
          }
          <div id="mobile-nav-btns">
            <button id="mobile-profile" onClick={() => navigate("/Profile")}>Profile</button>
            <button id="mobile-logout" onClick={logout}>Logout</button>
          </div>
        </div>
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
            <textarea id ="input-text" type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type message here..."></textarea>
            <button id="input-btn" onClick={sendMessage}>send</button>
          </div>  
        </div>
        <div className="future-content">
          <div className="nav-bar">
            <div className="first-nav-btns">
              <Link to='/profile' id="profile-link">
                <button id="profile" onClick={navigateToProfile}>
                  Profile
                </button>
              </Link>
              <button id="rooms-btn">
                <div className="tooltiptext">Coming soon!</div>
                Rooms
              </button>
            </div>
            <button id="logout" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
