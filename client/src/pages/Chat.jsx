import React, { useEffect, useState } from 'react';
import { getusers } from '../actions/chatactions';
import { useDispatch, useSelector } from "react-redux";
import { ChatUsers } from '../components';
import { useNavigate } from 'react-router-dom';
import { addMessage, setActiveChat } from '../actions/websocketActions';
import { jwtDecode } from "jwt-decode";

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
  console.log("Messages: ", messages)

  let loggedInUserId = null;

  if (userInfo && userInfo.access) {
    try {
      const decodedToken = jwtDecode(userInfo.access);
      loggedInUserId = decodedToken.user_id; // Extract user_id from decoded token
    } catch (error) {
      console.error("Error decoding token:", error); 
    }
  }
  console.log("Logged in User Id: ", loggedInUserId)

  // Fetch users on mount
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    } else {
      dispatch(getusers());
    }
  }, [dispatch, userInfo, navigate]);

  // WebSocket setup for the selected user
  useEffect(() => {
    if (selectedUser) {
      const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/chat/${selectedUser.id}/?token=${userInfo?.access}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established with', selectedUser.first_name);
      };

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        
        // Log the received message and userId to verify what the backend is sending
        console.log("Received message:", newMessage);
        console.log("Received userId from backend:", newMessage.userId);
      
        // No need to override the userId; trust the backend to send the correct userId
        const messageWithUserId = {
          ...newMessage,
        };
      
        dispatch(addMessage(messageWithUserId));
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
        userId: loggedInUserId // Attach logged-in user ID for sent messages
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
            <div key={index} className={`flex mb-4 ${msg.userId === loggedInUserId ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-96 p-3 rounded-lg ${msg.userId === loggedInUserId ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
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
