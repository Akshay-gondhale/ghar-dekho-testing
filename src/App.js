
import './App.css';
import Login from './screens/Login/Login';
import Registration from './screens/Registration/Registration';
import ForgotPassword from "./screens/ForgotPassword/ForgotPassword"
import PostProperty from "./screens/PostProperty/PostProperty"
// import PendingScreen from "./screens/PendingScreen"
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
import Home from './screens/Home/Home';
import ProtectedRoutes from './components/ProtectedRoutes';
import Profile from './screens/Profile/Profile';
import SingleHome from './screens/Profile/SingleHome';
import GlobalLoader from './components/GlobalLoader/GlobalLoader';
import Conversation from './screens/Conversation/Conversation';
import Properties from './screens/Properties/Properties';
import SingleProperty from './screens/Properties/SingleProperty';
import ChatScreen from './screens/Conversation/ChatScreen';
import Temp from './screens/Temp';
import ContactUs from './screens/ContactUs/ContactUs';
import AboutUs from './screens/AboutUs/AboutUs';
import { BaseApi } from "./utils/BaseApi"
import SavedHomes from "./screens/SavedHomes/SavedHomes"
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
// import { useEffect } from 'react';
// import "./utils/Axios"


axios.defaults.baseURL = BaseApi; 
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
  }, [dispatch])
  return (
    <div className="App">

      <Router>
        <ScrollToTop />
        <Switch>
          <AuthRoutes path='/login' component={Login} />
          <AuthRoutes exact path='/sign-up' component={Registration} />
          <AuthRoutes exact path='/forgot-password' component={ForgotPassword} />
          {isLoggedIn === null ? <GlobalLoader /> :
            <>
              <Navbar />
              <Route exact path='/' component={Home} />
              <Route exact path='/properties' component={Properties} />
              <Route exact path='/about' component={AboutUs} />
              <Route exact path='/contact' component={ContactUs} />
              <Route exact path='/temp' component={Temp} />
              <ProtectedRoutes exact path='/properties/:id' component={SingleProperty} />
              <ProtectedRoutes exact path='/profile' component={Profile} />
              <ProtectedRoutes exact path='/profile/home/:id' component={SingleHome} />
              <ProtectedRoutes exact path='/post-property' component={PostProperty} />
              <ProtectedRoutes exact path="/conversation" component={Conversation} />
              <ProtectedRoutes exact path="/saved-homes" component={SavedHomes} />
              <ProtectedRoutes exact path='/conversation/chat/:id' component={ChatScreen} />
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
