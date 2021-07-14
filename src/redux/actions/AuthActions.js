import axios from "axios";
import { AuthAction } from "../constants/AuthActionsTypes";

const RegisterAuthAction = (userData) => {
    return {type:AuthAction.REGISTER_SUCCESS, payload:userData}
}
const LoginAuthAction = (loginState, toast, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.post(`/user/login`,loginState)
        .then(res=>{
            console.log(res.data.data[0])
            toast.success(`Welcome Back ${res.data.data[0].name}`)
            setIsLoading(false)
            dispatch({type:AuthAction.LOGIN_SUCCESS, payload:res.data.data[0]})
        })
        .catch(err => {
            console.log(err)
            if(err.response){
                toast.error(err.response.data.message)
            }

            setIsLoading(false)
        })

    };
};
const getUser = () => {
    return async (dispatch) => {
        const auth = JSON.parse(localStorage.getItem("auth"));
        if(auth){
            axios.get(`/user/getUser/${auth.jwt}`)
            .then(res=>{
                console.log("got user from db", res.data)
                dispatch({type:AuthAction.GET_USER_SUCCESS, payload:{
                    name:res.data.name,
                    phone:res.data.phone,
                    email:res.data.email,
                    image:res.data.image,
                    jwt:auth.jwt,
                    expires:auth.expires
                }})
            })
            .catch(err=>{
                dispatch({type:AuthAction.GET_USER_SUCCESS, payload:{}})
            })
            
            console.log("logged in")
        }
        else{
            console.log("Not logged in")
            
        }

    };
};
export  {
    RegisterAuthAction,
    LoginAuthAction,
    getUser
}