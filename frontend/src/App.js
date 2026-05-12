import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
        <div>
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white bg-white text-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl font-bold font-mont tracking-wide',
              style: {
                background: 'inherit',
                color: 'inherit',
                fontSize: '1rem',
              },
            }}
          />
        </div>
        <Routes>
          <Route path='/' element={<ProtectedRoutes><Home></Home></ProtectedRoutes>} ></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/profile' element={<ProtectedRoutes><Profile /></ProtectedRoutes>} ></Route>
        </Routes>
    </div>
  );
}


export function ProtectedRoutes(props){
  if(localStorage.getItem("User"))
  {
    return props.children;
  }
  else{
    return <Navigate to='/login'></Navigate>
  }
}

export default App;
