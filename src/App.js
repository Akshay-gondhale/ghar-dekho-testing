
import './App.css';
import Login from './screens/Login';
import Registration from './screens/Registration';
import ForgotPassword from "./screens/ForgotPassword"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { getUser } from './redux/actions/AuthActions';
import { useEffect } from 'react';
import AuthRoutes from "./components/AuthRoutes"
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './screens/Home';
import ProtectedRoutes from './components/ProtectedRoutes';
import Profile from './screens/Profile';
import GlobalLoader from './components/GlobalLoader/GlobalLoader';
// import { useEffect } from 'react';
// import "./utils/Axios"


// axios.defaults.baseURL = 'https://ghar-dekho-backend.herokuapp.com';
axios.defaults.baseURL = 'http://localhost:4000';
// axios.interceptors.request.use(function (config) {
//   console.log("request ja rahi hai bhai")
//   console.log(config)
//   return config;
// }, function (error) {
//   // Do something with request error
//   return Promise.reject(error);
// });
function App() {
  const isLoggedIn = useSelector(state => state.AuthReducer.isLoggedIn)
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser())
  },[dispatch])
  return (
    <div className="App">

      <Router>
        <Switch>
          <AuthRoutes path='/login' component={Login} />
          <AuthRoutes exact path='/sign-up' component={Registration} />
          <AuthRoutes exact path='/forgot-password' component={ForgotPassword} />
          {isLoggedIn === null ? <GlobalLoader /> :
          <>
            <Navbar />
            <Route exact path='/' component={Home} />
            <ProtectedRoutes exact path='/profile' component={Profile}/>
            <Footer />
          </>
          }
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
