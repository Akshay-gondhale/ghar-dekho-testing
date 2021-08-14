import { ChatActionTypes } from "../constants/ChatActionTypes"
// import axios from "axios";
// import { toast } from "react-toastify";

const initChatRoom = (data, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        dispatch({
            type: ChatActionTypes.GET_INIT_CHAT_ROOMS_SUCCESS,
            payload: {
                data:data.data[0],
                messages:data.messages
            }
        })
        setIsLoading(false)
    }
}

const firstMsgInit = (data, setIsLoading) => {
    
    return async (dispatch) => {
        setIsLoading(true)
        dispatch({
            type: ChatActionTypes.FIRST_MESSAGE_INIT_CHAT,
            payload: {
                data:data.data[0],
                messages:data.messages
            }
        })
        setIsLoading(false)
    }
}

const insertNewMsg = (data) => {
    
    return async (dispatch) => {
        console.log(data)
        dispatch({
            type: ChatActionTypes.GET_NEW_MESSAGE,
            payload: data
        })
    }
}


export {
    initChatRoom,
    insertNewMsg,
    firstMsgInit
}