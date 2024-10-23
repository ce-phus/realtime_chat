import {
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    GET_USERS_FAIL
}  from "../constants/index"

import axios from "axios"
import logout from "./userActions"

const API_URL  = import.meta.env.VITE_API_URL

export const getusers= () => async(dispatch, getState) => {
    try {
        dispatch({
            type: GET_USERS_REQUEST
        });

        const {
            userLoginReducer: { userInfo },
        } = getState();

        if (!userInfo || !userInfo.access) {
            throw new Error("User is not authenticated")
        }

        const config = {
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${userInfo.access}`
            }
        }

        const { data } = await axios.get(`${API_URL}/api/users/`, config);

        dispatch({
            type: GET_USERS_SUCCESS,
            payload: data
        })
    } catch (error){
        dispatch({
            type: GET_USERS_FAIL,
            payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
          });
          if (error.response.data.detail === "Given token not valid for any token type") {
            console.log("error response: ",error.response.data.detail)
            dispatch(logout());
            
          }
    }
}