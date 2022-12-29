import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import axios from 'axios'

const Navbar = () => {
    const navigate = useNavigate()

    useEffect(()=>{
        let token = localStorage.getItem('user')
        let url = process.env.ENVIRONMENT=="PRODUCTION"?"https://blogs-app-p47g.onrender.com":"http://localhost:5000"
        if(!token){
            navigate('/',{replace:true})
            return
        }
        axios.get(`${url}/api/user/verify`,{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        }).then(()=>{})
         .catch(()=>{
            navigate('/',{replace:true})
        })
    },[])

    const logoutHandler = ()=>{
        localStorage.removeItem('user')
        navigate('/',{replace:true})
    }

    return ( 
        <nav className="navbar">
            <h1>Awesome Blogs</h1>
            <div className="links">
                <Link to="/home">Home</Link>
                <Link to="/create">Create Blog</Link>
            </div>
            <div className='logout' onClick={()=>logoutHandler()}>
                Logout
            </div>
        </nav>
     );
}
 
export default Navbar;