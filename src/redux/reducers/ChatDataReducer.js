import { ChatActionTypes } from "../constants/ChatActionTypes";

const chatState = {
    data:{
        _id: null,
        userId: null,
        propertyId: null,
        brokerId: null,
        lastMsg: null,
        messages: null
    },
    messages:[]
}


export const ChatDataReducer = (state = chatState, { type, payload }) => {
    switch (type) {

        case ChatActionTypes.GET_INIT_CHAT_ROOMS_SUCCESS:
            return {
            data:payload.data,
            messages:payload.messages
        }
        case ChatActionTypes.GET_INIT_CHAT_ROOMS_FAILS:
            return state
        case ChatActionTypes.GET_NEW_MESSAGE:
            console.log(payload)
            var updatedArray = state.messages;
            updatedArray.splice(0, 0, payload)
            return {
                data:state.data,
                messages:updatedArray
                
            };
        default:
            return state;
    }
}