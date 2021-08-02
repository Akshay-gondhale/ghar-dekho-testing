import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {ProfileDataReducer,NotificationDataReducer} from "./ProfileDataReducers"
import { SingleHomeDataReducer } from "./SingleHomeDataReducers";
import { PropertiesDataReducer } from "./PropertiesDataReducer";

const reducers = combineReducers({
  AuthReducer,
  ProfileDataReducer,
  NotificationDataReducer,
  SingleHomeDataReducer,
  PropertiesDataReducer
});

export default reducers;
