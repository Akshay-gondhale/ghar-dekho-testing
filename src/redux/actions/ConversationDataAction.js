import { ConversationActionTypes } from "../constants/ConversationActionTypes"
// import axios from "axios";
// import { toast } from "react-toastify";

const setChatRooms = (data, setIsLoading) => {
    return async (dispatch) => {
        setIsLoading(true)
        console.log(data)
        dispatch({
            type: ConversationActionTypes.GET_CHAT_ROOMS_SUCCESS,
            payload: data
        })
        setIsLoading(false)
    }
}


export {
    setChatRooms
}