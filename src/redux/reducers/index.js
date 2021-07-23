import { combineReducers } from "redux";
// import { productReducer, selectedProductReducer } from "./productReducer";
import {AuthReducer} from "./AuthReducers"
import {ProfileDataReducer} from "./ProfileDataReducers"

const reducers = combineReducers({
  // allProducts: productReducer,
  // product: selectedProductReducer,
  AuthReducer,
  ProfileDataReducer,
});

export default reducers;
