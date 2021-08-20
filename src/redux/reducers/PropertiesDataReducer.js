import { PropertiesActionTypes } from "../constants/PropertiesActionTypes";


const propertiesState = {
    isNextAvailable: false,
    lastId: null,
    data: []
}



export const PropertiesDataReducer = (state = propertiesState, { type, payload }) => {
    switch (type) {
        case PropertiesActionTypes.GET_PROPERTY_DATA_SUCCESS:
            return {
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case PropertiesActionTypes.GET_PROPERTY_DATA_FAILS:
            return state;
        default:
            return state;
    }
}

// for saved properties
const savedPropertiesState = {
    isNextAvailable: false,
    lastId: null,
    data: []
}

export const SavedPropertiesDataReducer = (state = savedPropertiesState, { type, payload }) => {
    switch (type) {
        case PropertiesActionTypes.GET_SAVED_HOMES_DATA_SUCCESS:
            return {
                data: payload.data,
                isNextAvailable: payload.isNextAvailable,
                lastId: payload.lastId
            }
        case PropertiesActionTypes.GET_SAVED_HOMES_DATA_FAILS:
            return state;
        case PropertiesActionTypes.REMOVE_SAVED_HOMES_DATA:
            return {
                isNextAvailable: false,
                lastId: null,
                data: []
            }
        default:
            return state;
    }
}