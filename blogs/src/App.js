import Navbar from './navbar'
import Home from './home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Create from './create';
import BlogDetails from './blogDetails';
import NotFound from './notFound';
import Register from './register';
import Login from './login';
import EmailVerification from './emailVerification';
import ChangePassword from './changePassword';
import AccountVerification from './accountVerification';

function App() {
  return (
    <Router>
        <div className='content'>
          <Routes>
          <Route path='/register' element={<Register/>} />
          <Route path='/' element={<Login/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/create' element={<Create/>} />
          <Route path='/blogs' element={<BlogDetails/>} />
          <Route path='/emailVerification' element={<EmailVerification/>} />
          <Route path='/changePassword' element={<ChangePassword/>} />
          <Route path='/accountVerification' element={<AccountVerification/>} />
          <Route path='*' element={<NotFound/>} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
