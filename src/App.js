
import './App.css';
import Login from './screens/Login';
import Registration from './screens/Registration';
import ForgotPassword from "./screens/ForgotPassword"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from "axios"
import { useDispatch } from "react-redux";
import { getUser } from './redux/actions/AuthActions';
import { useEffect } from 'react';
import AuthRoutes from "./components/AuthRoutes"
import Navbar from './components/Navbar/Navbar';
// import { useEffect } from 'react';
// import "./utils/Axios"


axios.defaults.baseURL = 'https://ghar-dekho-backend.herokuapp.com';
// axios.defaults.baseURL = 'http://localhost:4000';
// axios.interceptors.request.use(function (config) {
//   console.log("request ja rahi hai bhai")
//   console.log(config)
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });
function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser())
  })
  return (
    <div className="App">

      <Router>
        <Switch>
          <AuthRoutes path='/login' component={Login} />
          <AuthRoutes exact path='/sign-up' component={Registration} />
          <AuthRoutes exact path='/forgot-password' component={ForgotPassword} />
          <>
            <Navbar />
          </>
        </Switch>
      </Router>
      <ToastContainer
        position="bottom-left"
        autoClose={7000}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
