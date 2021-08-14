import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {ProfileDataReducer,NotificationDataReducer} from "./ProfileDataReducers"
import { SingleHomeDataReducer, othersSingleHomeDataReducer } from "./SingleHomeDataReducers";
import { PropertiesDataReducer } from "./PropertiesDataReducer";
import { ConversationDataReducer } from "./ConversationDataReducer";
import { ChatDataReducer } from "./ChatDataReducer";

const reducers = combineReducers({
  AuthReducer,
  ProfileDataReducer,
  NotificationDataReducer,
  SingleHomeDataReducer,
  PropertiesDataReducer,
  othersSingleHomeDataReducer,
  ConversationDataReducer,
  ChatDataReducer
});

export default reducers;
