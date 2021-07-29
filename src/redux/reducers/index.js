import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {ProfileDataReducer,NotificationDataReducer} from "./ProfileDataReducers"
import { SingleHomeDataReducer } from "./SingleHomeDataReducers";

const reducers = combineReducers({
  AuthReducer,
  ProfileDataReducer,
  NotificationDataReducer,
  SingleHomeDataReducer
});

export default reducers;
