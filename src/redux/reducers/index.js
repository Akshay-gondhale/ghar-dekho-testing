import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"

const reducers = combineReducers({
  // allProducts: productReducer,
  // product: selectedProductReducer,
  AuthReducer
});

export default reducers;
