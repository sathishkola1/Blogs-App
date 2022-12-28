import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const LayoutNav = () => {
    const navigate = useNavigate()

    useEffect(()=>{
        let token = localStorage.getItem('user')
        if(token){
            // check().then(navigate('/home',{replace:true})).catch()
            navigate('/home',{replace:true})
        }
    },[])

    return ( 
        <nav className="navbar">
            <h1>Awesome Blogs</h1>
            <div className="layoutLinks">
                <Link to="/register">Register</Link>
                <Link to="/">Login</Link>
            </div>
        </nav>
     );
}
 
export default LayoutNav;