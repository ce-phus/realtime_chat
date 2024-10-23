export const ADD_MESSAGE = 'ADD_MESSAGE';
export const SET_ACTIVE_CHAT = 'SET_ACTIVE_CHAT';

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const setActiveChat = (user) => ({
  type: SET_ACTIVE_CHAT,
  payload: user,
});
