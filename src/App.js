
import './App.css';
import Login from './screens/Login';
import Registration from './screens/Registration';
import ForgotPassword from "./screens/ForgotPassword"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from "axios"
// import { useEffect } from 'react';
// import "./utils/Axios"


axios.defaults.baseURL = 'https://ghar-dekho-backend.herokuapp.com';
axios.interceptors.request.use(function (config) {
  console.log("request ja rahi hai bhai")
  console.log(config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
function App() {

  return (
    <div className="App">

      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/sign-up' component={Registration} />
          <Route exact path='/forgot-password' component={ForgotPassword} />
          {/* <Registration />
          <Login /> */}
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
