import { ProfileAction } from "../constants/ProfileActionTypes";
const profileDataState = {
    subSection: "",
    isNextAvailable: false,
    lastId: null,
    data: []
};

const notificationState = {
    isNextAvailable: false,
    lastId: null,
    data: []
}

export const ProfileDataReducer = (state = profileDataState, { type, payload }) => {
    switch (type) {
        case ProfileAction.GET_SUBSECTION_DATA_SUCCESS:
            return {
                subSection: payload.subSection,
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case ProfileAction.GET_SUBSECTION_DATA_FAILS:
            return state;
        case ProfileAction.LOAD_MORE_SUBSECTION_DATA_SUCCESS:
            return {
                subSection: payload.subSection,
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case ProfileAction.LOAD_MORE_SUBSECTION_DATA_FAILS:
            return state;
        case ProfileAction.REMOVE_PROFILE_STATE_DATA:
            return {
                subSection: "",
                isNextAvailable: false,
                lastId: null,
                data: []
            };
        default:
            return state;
    }
}

export const NotificationDataReducer = (state = notificationState, { type, payload }) => {
    switch (type) {
        case ProfileAction.GET_NOTIFICATION_DATA_SUCCESS:
            return {
                subSection: payload.subSection,
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case ProfileAction.GET_NOTIFICATION_DATA_FAILS:
            return state;
        case ProfileAction.REMOVE_NOTIFICATION_STATE_DATA:
            return {
                isNextAvailable: false,
                lastId: null,
                data: []
            };
        default:
            return state;
    }
}