import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveChat } from '../actions/websocketActions';

const ChatUsers = ({ user }) => {
  const dispatch = useDispatch();

  const handleUserClick = () => {
    dispatch(setActiveChat(user));
  };

  return (
    <div
      className='flex items-center mb-4 hover:bg-gray-300 rounded-md cursor-pointer'
      onClick={handleUserClick} // Attach the click handler
    >
      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
        <img
          src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{user.first_name}</h2>
        <p className="text-gray-600">Hoorayy!!</p>
      </div>
    </div>
  );
};

export default ChatUsers;
