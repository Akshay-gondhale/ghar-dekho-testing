import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {ProfileDataReducer,NotificationDataReducer} from "./ProfileDataReducers"

const reducers = combineReducers({
  AuthReducer,
  ProfileDataReducer,
  NotificationDataReducer
});

export default reducers;
