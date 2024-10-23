import { ADD_MESSAGE, SET_ACTIVE_CHAT } from '../actions/websocketActions';

const initialState = {
  activeChat: null,
  messages: [],
};

export const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case SET_ACTIVE_CHAT:
      return {
        ...state,
        activeChat: action.payload,
        messages: [],  
      };
    default:
      return state;
  }
};
