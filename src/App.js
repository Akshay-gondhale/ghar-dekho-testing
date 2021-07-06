
import './App.css';
import Login from './screens/Login';
import Registration from './screens/Registration';
import ForgotPassword from "./screens/ForgotPassword"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
