import { ProfileAction } from "../constants/ProfileActionTypes";
const profileDataState = {
    subSection: "",
    isNextAvailable: false,
    lastId: null,
    data: []
};


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
        default:
            return state;
    }
}