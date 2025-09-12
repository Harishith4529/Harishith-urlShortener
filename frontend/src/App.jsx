import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import './index.css';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu';
<<<<<<< HEAD
import Profile from './Pages/profile';
=======
>>>>>>> f5d4ed32908f7f84fa0fab041c59113535cfccbc


function App() {
  return (
    <Router>
        <HeaderMegaMenu/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginPage/>} />
            <Route element={<PrivateRoute/>}>
<<<<<<< HEAD
            <Route path='/profile' element={<Profile/>} />
=======

>>>>>>> f5d4ed32908f7f84fa0fab041c59113535cfccbc
            </Route>
        </Routes>
    </Router>
  )
}

export default App
