import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react"

const Navbar = () => {
    // const [user, setUser] = useState(localStorage.getItem('user'))
    const navigate = useNavigate()

    // useEffect(()=>{
    //     if(!user){
    //         logoutHandler()
    //     }

    // },[user])

    useEffect(()=>{
        let token = localStorage.getItem('user')
        if(!token){
            navigate('/',{replace:true})
            return
        }
        // check().then().catch()
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