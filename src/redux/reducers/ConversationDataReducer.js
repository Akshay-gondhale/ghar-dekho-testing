import { ConversationActionTypes } from "../constants/ConversationActionTypes"

const conversationState = {
    newMessage: {
        isNextAvailable: false,
        lastId: null,
        data: []
    },
    oldMessage: {
        isNextAvailable: false,
        lastId: null,
        data: []
    }
}


export const ConversationDataReducer = (state = conversationState, { type, payload }) => {
    switch (type) {
        case ConversationActionTypes.GET_CHAT_ROOMS_SUCCESS:
            return payload
        case ConversationActionTypes.GET_CHAT_ROOMS_FAILS:
            return state;
        default:
            return state

    }
}