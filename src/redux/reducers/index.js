import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {HomeDataReducer} from "./HomeDataReducers"
import { SingleHomeDataReducer } from "./SingleHomeDataReducers";
import {ConversationDataReducer} from "./ConversationDataReducer"
import {ChatDataReducer} from "./ChatDataReducer"

const reducers = combineReducers({
  // allProducts: productReducer,
  // product: selectedProductReducer,
  AuthReducer,
  HomeDataReducer,
  SingleHomeDataReducer,
  ConversationDataReducer,
  ChatDataReducer

  
});

export default reducers;
