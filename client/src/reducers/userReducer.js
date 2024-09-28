import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_ACTIVATE_REQUEST,
    USER_ACTIVATE_SUCCESS,
    USER_ACTIVATE_FAIL,
    USER_RESET_PASSWORD_REQUEST,
    USER_RESET_PASSWORD_SUCCESS,
    USER_RESET_PASSWORD_FAIL,
    USER_RESET_PASSWORD_CONFIRM_REQUEST,
    USER_RESET_PASSWORD_CONFIRM_SUCCESS,
    USER_RESET_PASSWORD_CONFIRM_FAIL
} from '../constants/index';

const initialState = {
    userInfo: null,
    loading: false,
    error: null
};

export const userLoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { ...state, loading: true };
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload, error: null };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload, userInfo: null };
        case USER_LOGOUT:
            return { ...initialState };
        default:
            return state;
    }
};

export const userRegisterReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { ...state, loading: true };
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload, error: null };
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload, userInfo: null };
        default:
            return state;
    }
};

const userActivateInitialState = {
    loading: false,
    success: false,
    error: null
};

export const userActivateReducer = (state = userActivateInitialState, action) => {
    switch (action.type) {
        case USER_ACTIVATE_REQUEST:
            return { loading: true, success: false };
        case USER_ACTIVATE_SUCCESS:
            return { loading: false, success: true, error: null };
        case USER_ACTIVATE_FAIL:
            return { loading: false, success: false, error: action.payload };
        default:
            return state;
    }
};

const resetPasswordInitialState = {
    loading: false,
    success: false,
    error: null
};

export const userResetPasswordReducer = (state = resetPasswordInitialState, action) => {
    switch (action.type) {
        case USER_RESET_PASSWORD_REQUEST:
            return { loading: true, success: false };
        case USER_RESET_PASSWORD_SUCCESS:
            return { loading: false, success: true, error: null };
        case USER_RESET_PASSWORD_FAIL:
            return { loading: false, success: false, error: action.payload };
        default:
            return state;
    }
};

export const userResetPasswordConfirmReducer = (state = resetPasswordInitialState, action) => {
    switch (action.type) {
        case USER_RESET_PASSWORD_CONFIRM_REQUEST:
            return { loading: true, success: false };
        case USER_RESET_PASSWORD_CONFIRM_SUCCESS:
            return { loading: false, success: true, error: null };
        case USER_RESET_PASSWORD_CONFIRM_FAIL:
            return { loading: false, success: false, error: action.payload };
        default:
            return state;
    }
};
