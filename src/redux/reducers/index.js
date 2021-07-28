import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {HomeDataReducer} from "./HomeDataReducers"
import { SingleHomeDataReducer } from "./SingleHomeDataReducers";

const reducers = combineReducers({
  // allProducts: productReducer,
  // product: selectedProductReducer,
  AuthReducer,
  HomeDataReducer,
  SingleHomeDataReducer
});

export default reducers;
