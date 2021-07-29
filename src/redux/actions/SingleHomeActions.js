import { SingleHomeAction } from "../constants/SingleHomeActionTypes";
import axios from "axios";
import { toast } from "react-toastify";



const GetHomeDetails = (id, setIsLoading, history) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/broker/home/${id}`)
        .then(res=>{
            dispatch({type:SingleHomeAction.GET_HOME_DATA_SUCCESS, payload:{
                data:res.data.data[0]
            }})
            setIsLoading(false)
        })
        .catch(err=>{
            console.log({res:err.response})
            dispatch({type:SingleHomeAction.GET_HOME_DATA_FAILS, payload:{}})
            if(err.response){
                toast.error(err.response.data.message)
            }
            else{
                toast.error("Something went wrong!")
            }
            setIsLoading(false)
            history.push("/homes")
        })
    }   
}

const RemoveHomeDetails = (id, setIsLoading, history) => {
    return async (dispatch) => {
        dispatch({type:SingleHomeAction.REMOVE_HOME_DATA, payload:{}})
    }
}


export {
    GetHomeDetails,
    RemoveHomeDetails
}