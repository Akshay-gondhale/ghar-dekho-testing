import { SingleHomeAction } from "../constants/SingleHomeActionTypes";
import axios from "axios";
import { toast } from "react-toastify";



const GetHomeDetails = (id, setIsLoading, history) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/home/${id}`)
            .then(res => {
                dispatch({
                    type: SingleHomeAction.GET_HOME_DATA_SUCCESS, payload: {
                        data: res.data.data[0]
                    }
                })
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                dispatch({ type: SingleHomeAction.GET_HOME_DATA_FAILS, payload: {} })
                if (err.response) {
                    toast.error(err.response.data.message)
                    history.push("/profile")
                    return
                }
                toast.error("Something went wrong!")
                history.push("/profile")

            })
    }
}

const RemoveHomeDetails = (id, setIsLoading, history) => {
    return async (dispatch) => {
        dispatch({ type: SingleHomeAction.REMOVE_HOME_DATA, payload: {} })
    }
}


export {
    GetHomeDetails,
    RemoveHomeDetails
}