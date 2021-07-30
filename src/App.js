
import './App.css';
import Login from './screens/Login/Login';
import Registration from './screens/Registration/Registration';
import ForgotPassword from "./screens/ForgotPassword/ForgotPassword"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import axios from "axios"
import { useDispatch, useSelector } from "react-redux";
import { getUser } from './redux/actions/AuthActions';
import { useEffect } from 'react';
import AuthRoutes from "./components/AuthRoutes"
import ProtectedRoutes from './components/ProtectedRoutes';
import GlobalLoader from "./components/GlobalLoader/GlobalLoader"
import Sidebar from './components/Sidebar/Sidebar';
import Homes from './screens/Homes/Homes';
import SingleHome from './screens/Homes/SingleHome';
import PendingScreeen from "./screens/PendingScreen"


// axios.defaults.baseURL = 'https://ghar-dekho-backend.herokuapp.com';
axios.defaults.baseURL = 'http://localhost:4000';
function App() {
  const isLoggedIn = useSelector(state => state.AuthReducer.isLoggedIn)

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])
  return (
    <div className="App">

      <Router>
        <Switch>
          <AuthRoutes path='/login' component={Login} />
          <AuthRoutes exact path='/sign-up' component={Registration} />
          <AuthRoutes exact path='/forgot-password' component={ForgotPassword} />
          {isLoggedIn === null ? <GlobalLoader /> :
            <>
            <Sidebar />
            <div className="mainDiv">
              <ProtectedRoutes exact path="/" component={PendingScreeen} />
              <ProtectedRoutes exact path="/homes" component={Homes} />
              <ProtectedRoutes exact path="/homes/:id" component={SingleHome} />
              <ProtectedRoutes exact path="/users" component={PendingScreeen} />
            </div>
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
