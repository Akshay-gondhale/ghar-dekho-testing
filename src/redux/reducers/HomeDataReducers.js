import { HomeAction } from "../constants/HomeActionTypes";
const homeDataState = {
    subSection: "",
    isNextAvailable: false,
    lastId: null,
    data: []
};


export const HomeDataReducer = (state = homeDataState, { type, payload }) => {
    switch (type) {
        case HomeAction.GET_SUBSECTION_DATA_SUCCESS:
            return {
                subSection: payload.subSection,
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case HomeAction.GET_SUBSECTION_DATA_FAILS:
            return state;
        case HomeAction.LOAD_MORE_SUBSECTION_DATA_SUCCESS:
            return {
                subSection: payload.subSection,
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case HomeAction.LOAD_MORE_SUBSECTION_DATA_FAILS:
            return state;
        default:
            return state;
    }
}