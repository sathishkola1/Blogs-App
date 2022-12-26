import Navbar from './navbar'
import Home from './home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Create from './create';
import BlogDetails from './blogDetails';
import NotFound from './notFound';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className='content'>
          <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/create' element={<Create/>} />
          <Route path='/blogs' element={<BlogDetails/>} />
          <Route path='*' element={<NotFound/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
