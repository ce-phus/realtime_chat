import { combineReducers } from "redux";

import { 
    userLoginReducer,
    userRegisterReducer,
    userActivateReducer,
    userResetPasswordConfirmReducer,
    userResetPasswordReducer,
     } from "./userReducer";

import {
    getUsersReducers
} from "./chatReducer";

import {
    websocketReducer
} from "./websocketReducer"

const allReducers = combineReducers({
    userLoginReducer,
    userRegisterReducer,
    userActivateReducer,
    userResetPasswordConfirmReducer,
    userResetPasswordReducer,
    getUsersReducers,
    websocket:websocketReducer
})

export default allReducers