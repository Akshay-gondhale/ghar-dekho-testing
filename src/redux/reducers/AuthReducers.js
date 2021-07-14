import axios from "axios";
import { AuthAction } from "../constants/AuthActionsTypes";

const authState = {
    isLoggedIn: false,
    user: {
        name: "",
        email: "",
        phone: "",
        image:"",
        jwt: "",
        expires: ""
    }
};


export const AuthReducer = (state = authState, { type, payload }) => {
    switch (type) {
        case AuthAction.REGISTER_SUCCESS:
            localStorage.setItem("auth", JSON.stringify({ jwt: payload.token, expires: payload.expires }));
            return{
                isLoggedIn: true,
                user: {
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image:payload.image,
                    jwt: payload.token,
                    expires: payload.expires
                }
            }

        case AuthAction.REGISTER_FAIL:
            return state;
        case AuthAction.LOGIN_SUCCESS:
            const newAuthState = {
                isLoggedIn: true,
                user: {
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image:payload.image,
                    jwt: payload.token,
                    expires: payload.expires
                }
            };
            localStorage.setItem("auth", JSON.stringify({ jwt: newAuthState.user.jwt, expires: newAuthState.user.expires }));
            return newAuthState
        case AuthAction.LOGIN_FAIL:
            return state;

        case AuthAction.GET_USER_SUCCESS:
            axios.defaults.headers.common['Authorization'] = `Bearer ${payload.jwt}`;
            console.log(axios)
            return  {
                isLoggedIn: true,
                user: {
                    name: payload.name,
                    phone: payload.phone,
                    email: payload.email,
                    image:payload.image,
                    jwt: payload.jwt,
                    expires: payload.expires
                }
            };
        case AuthAction.GET_USER_FAIL:
            return state;
        default:
            return state;
    }
};