
import './App.css';
// import Login from './screens/Login';
import Registration from './screens/Registration';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Registration />
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
