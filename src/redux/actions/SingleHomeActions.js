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

const GetOthersHomeDetails = (id, setIsLoading, history) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.get(`/user/property/${id}`)
            .then(res => {
                dispatch({
                    type: SingleHomeAction.GET_OTHERS_HOME_DATA_SUCCESS, payload: {
                        foundProperty: res.data.data[0].foundProperty,
                        isSavedHome:res.data.data[0].isSavedHome,
                    }
                })
                setIsLoading(false)
            })
            .catch(err => {
                setIsLoading(false)
                dispatch({ type: SingleHomeAction.GET_OTHERS_HOME_DATA_FAILS, payload: {} })
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
const RemoveOthersHomeDetails = (id, setIsLoading, history) => {
    return async (dispatch) => {
        dispatch({ type: SingleHomeAction.REMOVE_OTHERS_HOME_DATA, payload: {} })
    }
}

const SaveHome = (foundProperty, id, setIsLoading, toast) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.post(`/user/saveProperty/${id}`)
        .then(res=>{
            dispatch({
                type:SingleHomeAction.SAVE_HOME_SUCCESS,
                payload:{
                    foundProperty:foundProperty,
                    isSavedHome:res.data.data[0]
                }
            })
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            setIsLoading(false)
            dispatch({ type: SingleHomeAction.SAVE_HOME_FAILS, payload: {} })
            if (err.response) {
                toast.error(err.response.data.message)
                return
            }
            toast.error("Something went wrong!")
        })
    }
}

const RemoveSaveHome = (foundProperty, id, setIsLoading, toast) => {
    return async (dispatch) => {
        setIsLoading(true)
        axios.delete(`/user/removeSaveProperty/${id}`)
        .then(res=>{
            dispatch({
                type:SingleHomeAction.REMOVE_SAVE_HOME_SUCCESS,
                payload:{
                    foundProperty:foundProperty,
                    
                }
            })
            setIsLoading(false)
        })
        .catch(err=>{
            console.log(err)
            setIsLoading(false)
            dispatch({ type: SingleHomeAction.REMOVE_SAVE_HOME_FAILS, payload: {} })
            if (err.response) {
                toast.error(err.response.data.message)
                return
            }
            toast.error("Something went wrong!")
        })
    }
}

export {
    GetHomeDetails,
    RemoveHomeDetails,
    GetOthersHomeDetails,
    RemoveOthersHomeDetails,
    SaveHome,
    RemoveSaveHome
}