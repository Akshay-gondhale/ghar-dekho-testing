import axios from "axios";
import { AuthAction } from "../constants/AuthActionsTypes";

const authState = {
    isLoggedIn: null,
    user: {
        _id: "",
        name: "",
        email: "",
        phone: "",
        image: "",
        jwt: "",
        expires: "",
        createdAt: ""
    }
};


export const AuthReducer = (state = authState, { type, payload }) => {
    switch (type) {
        case AuthAction.REGISTER_SUCCESS:

            axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
            localStorage.setItem("auth", JSON.stringify({ jwt: payload.token, expires: payload.expires }));
            return {
                isLoggedIn: true,
                user: {
                    _id: payload._id,
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image: payload.image,
                    jwt: payload.token,
                    expires: payload.expires,
                    createdAt: payload.createdAt
                }
            }

        case AuthAction.REGISTER_FAIL:
            return {
                isLoggedIn: false,
                user: {
                    _id: "",
                    name: "",
                    phone: "",
                    email: "",
                    image: "",
                    jwt: "",
                    expires: "",
                    createdAt: ""
                }
            };
        case AuthAction.LOGIN_SUCCESS:
            axios.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`;
            const newAuthState = {
                isLoggedIn: true,
                user: {
                    _id: payload._id,
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image: payload.image,
                    jwt: payload.token,
                    expires: payload.expires,
                    createdAt: payload.createdAt
                }
            };
            localStorage.setItem("auth", JSON.stringify({ jwt: newAuthState.user.jwt, expires: newAuthState.user.expires }));
            return newAuthState
        case AuthAction.LOGIN_FAIL:
            return {
                isLoggedIn: false,
                user: {
                    _id: "",
                    name: "",
                    phone: "",
                    email: "",
                    image: "",
                    jwt: "",
                    expires: "",
                    createdAt: ""
                }
            };

        case AuthAction.GET_USER_SUCCESS:
            axios.defaults.headers.common['Authorization'] = `Bearer ${payload.jwt}`;
            return {
                isLoggedIn: true,
                user: {
                    _id: payload._id,
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image: payload.image,
                    jwt: payload.jwt,
                    expires: payload.expires,
                    createdAt: payload.createdAt
                }
            };
        case AuthAction.GET_USER_FAIL:
            return {
                isLoggedIn: false,
                user: {
                    _id: "",
                    name: "",
                    phone: "",
                    email: "",
                    image: "",
                    jwt: "",
                    expires: "",
                    createdAt: ""
                }
            };
        case AuthAction.PROFILE_UPDATE_SUCCESS:
            return {
                isLoggedIn: true,
                user: {
                    _id: payload._id,
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image: payload.image,
                    jwt: payload.jwt,
                    expires: payload.expires,
                    createdAt: payload.createdAt
                }
            };

        case AuthAction.LOGOUT_SUCCESS:
            localStorage.removeItem("auth");
            return {
                isLoggedIn: false,
                user: {
                    _id: "",
                    name: "",
                    email: "",
                    phone: "",
                    image: "",
                    jwt: "",
                    expires: "",
                    createdAt: ""
                }
            };

        default:
            return state;
    }
};