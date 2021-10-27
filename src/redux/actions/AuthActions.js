import axios from "axios";
import { AuthAction } from "../constants/AuthActionsTypes";

const RegisterAuthAction = (userData) => {
    return { type: AuthAction.REGISTER_SUCCESS, payload: userData }
}
const LoginAuthAction = (loginState, toast, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios({
            method: "post",
            url: "/user/login",
            data: loginState,
            headers: { "Content-Type": "application/json" },
        })
            .then(res => {
                console.log(res.data.data[0])
                toast.success(`Welcome Back ${res.data.data[0].name}`)
                setIsLoading(false)
                dispatch({ type: AuthAction.LOGIN_SUCCESS, payload: res.data.data[0] })
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    console.log(err.response.data)
                    toast.error(err.response.data.message)
                }
                else {
                    toast.error("Unable to connect server please try later!")
                }

                setIsLoading(false)
            })

    };
};
const getUser = () => {
    return async (dispatch) => {
        try {
            const auth = JSON.parse(localStorage.getItem("auth"));
            if (auth) {
                axios.get(`/user`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + auth.jwt
                    }
                })
                    .then(res => {
                        console.log("got user from db", res.data.data[0])
                        dispatch({
                            type: AuthAction.GET_USER_SUCCESS, payload: {
                                _id: res.data.data[0]._id,
                                name: res.data.data[0].name,
                                phone: res.data.data[0].phone,
                                email: res.data.data[0].email,
                                image: res.data.data[0].image,
                                jwt: auth.jwt,
                                expires: auth.expires,
                                createdAt: res.data.data[0].createdAt
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        dispatch({ type: AuthAction.GET_USER_FAIL, payload: {} })
                    })

                console.log("logged in")
            }
            else {
                dispatch({ type: AuthAction.GET_USER_FAIL, payload: {} })
                console.log("Not logged in")

            }


        }
        catch (e) {
            console.log(e)
            dispatch({ type: AuthAction.GET_USER_FAIL, payload: {} })
        }

    };
};


const updateProfile = (formData, toast, history, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        const auth = JSON.parse(localStorage.getItem("auth"));
        axios({
            method: "put",
            url: "/user/update",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(res => {
                dispatch({
                    type: AuthAction.PROFILE_UPDATE_SUCCESS, payload: {
                        _id: res.data.data[0]._id,
                        name: res.data.data[0].name,
                        phone: res.data.data[0].phone,
                        email: res.data.data[0].email,
                        image: res.data.data[0].image,
                        jwt: auth.jwt,
                        expires: auth.expires,
                        createdAt: res.data.data[0].createdAt
                    }
                })
                setIsLoading(false)
                toast.success("Profile Updated! 😃")
                history.push("/")
            })
            .catch(err => {
                console.log(err)
                if (err.response) {
                    console.log(err.response.data)
                    toast.error(err.response.data.message)
                }
                else {
                    toast.error("Unable to connect server please try later!")
                }

                setIsLoading(false)
                dispatch({ type: AuthAction.PROFILE_UPDATE_FAIL, payload: {} })
            })

    }
}

const LogoutUser = (toast) => {
    return async (dispatch) => {
        try {
            dispatch({ type: AuthAction.LOGOUT_SUCCESS, payload: {} })
            toast.success("Logout successfully.!")
        }
        catch (e) {
            console.log(e)
            toast.error("Can't log you out. Something went wrong :(")

        }
    }
}
export {
    RegisterAuthAction,
    LoginAuthAction,
    getUser,
    updateProfile,
    LogoutUser
}