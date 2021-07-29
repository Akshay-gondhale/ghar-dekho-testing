import { SingleHomeAction } from "../constants/SingleHomeActionTypes";
const singleHomeDataState = {
    foundData: null,
    details: {}
};


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