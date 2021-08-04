import { SingleHomeAction } from "../constants/SingleHomeActionTypes";
const singleHomeDataState = {
    foundData: null,
    details: {}
};


const othersSingleHomeDataState = {
    foundData: null,
    foundProperty: {},
    isSavedHome: null
}


export const SingleHomeDataReducer = (state = singleHomeDataState, { type, payload }) => {
    switch (type) {
        case SingleHomeAction.GET_HOME_DATA_SUCCESS:
            return {
                foundData: true,
                details: payload.data,
            }
        case SingleHomeAction.GET_HOME_DATA_FAILS:
            return state;
        case SingleHomeAction.REMOVE_HOME_DATA:
            return {
                foundData: null,
                details: {},
            }
        default:
            return state;
    }
}

export const othersSingleHomeDataReducer = (state = othersSingleHomeDataState, { type, payload }) => {
    switch (type) {
        case SingleHomeAction.GET_OTHERS_HOME_DATA_SUCCESS:
            return {
                foundData: true,
                foundProperty: payload.foundProperty,
                isSavedHome: payload.isSavedHome,
            }
        case SingleHomeAction.GET_OTHERS_HOME_DATA_FAILS:
            return state;
        case SingleHomeAction.REMOVE_OTHERS_HOME_DATA:
            return {
                foundData: null,
                foundProperty: {},
                isSavedHome: null
            }
        case SingleHomeAction.SAVE_HOME_SUCCESS:
            return {
                foundData: true,
                foundProperty: payload.foundProperty,
                isSavedHome: payload.isSavedHome
            }
        case SingleHomeAction.SAVE_HOME_FAILS:
            return state;
        case SingleHomeAction.REMOVE_SAVE_HOME_SUCCESS:
            return {
                foundData: true,
                foundProperty: payload.foundProperty,
                isSavedHome: null
            }
        case SingleHomeAction.REMOVE_SAVE_HOME_FAILS:
            return state;
        default:
            return state;
    }
}