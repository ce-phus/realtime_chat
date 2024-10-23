import React, { useEffect, useState } from 'react';
import { getusers } from '../actions/chatactions';
import { useDispatch, useSelector } from "react-redux";
import { ChatUsers } from '../components';
import { useNavigate } from 'react-router-dom';
import { addMessage, setActiveChat } from '../actions/websocketActions';

import {jwtDecode} from "jwt-decode";

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { loading, users, error } = useSelector((state) => state.getUsersReducers);
  const { userInfo } = useSelector((state) => state.userLoginReducer);
  const activeChat = useSelector((state) => state.websocket.activeChat);
  const messages = useSelector((state) => state.websocket.messages);

  console.log("Users: ", users)

  // Fetch users on mount
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    } else {
      dispatch(getusers());
    }
  }, [dispatch, userInfo, navigate]);

  let loggedInUserId = null;

    if (userInfo && userInfo.access) {
        // Decode the JWT to get the user information
        const decodedToken = jwtDecode(userInfo.access);
        loggedInUserId = decodedToken; // Extract user_id
    }
    console.log("Loggin user id: ", loggedInUserId?.user_id)

  // WebSocket setup for the selected user
  useEffect(() => {
    if (selectedUser) {
        const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/chat/${selectedUser.id}/?token=${userInfo.access}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connection established with', selectedUser.first_name);
        };

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            dispatch(addMessage(newMessage));
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }
}, [selectedUser, userInfo, dispatch]);


  // Handle sending a message
  const handleSendMessage = () => {
    if (socket && message && selectedUser) {
      const payload = {
        message: message,
      };
      socket.send(JSON.stringify(payload));
      setMessage('');
    }
  };

  // Function to select a user and open a chat
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    dispatch(setActiveChat(user));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 bg-white border-r border-gray-300">
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
          <h1 className="text-2xl font-semibold">Chat Web</h1>
        </header>
        
        <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="flex flex-col space-y-2">
              {users && users.map((user) => (
                <div key={user.id} onClick={() => handleSelectUser(user)}>
                  <ChatUsers user={user} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1">
        <header className="bg-white p-4 text-gray-700">
          <h1 className="text-2xl font-semibold">{selectedUser ? selectedUser.first_name : 'Select a chat'}</h1>
        </header>

        <div className="h-screen overflow-y-auto p-4 pb-36">
          {messages.map((msg, index) => (
            <div key={index} className={`flex mb-4 ${msg.userId === loggedInUserId.user_id  ? 'justify-end' : ''}`}>
              <div className={`flex max-w-96 ${msg.userId === loggedInUserId.id ? 'bg-indigo-500 text-white' : 'bg-white'} rounded-lg p-3 gap-3`}>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Chat;
