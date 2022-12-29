import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

const LayoutNav = () => {
    const navigate = useNavigate()

    useEffect(()=>{
        let token = localStorage.getItem('user')
        let url = process.env.REACT_APP_ENVIRONMENT=="PRODUCTION"?"https://blogs-app-p47g.onrender.com":"http://localhost:5000"
        if(token){
            axios.get(`${url}/api/user/verify`,{
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                }
            }).then(()=>{
                navigate('/home',{replace:true})
            }).catch((err)=>{
                localStorage.removeItem('user')
                console.log(err)
            })
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