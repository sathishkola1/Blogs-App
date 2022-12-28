import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import useAxios from "./useAxios";
import Navbar from './navbar'

const BlogDetails = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { data:blog, isLoading, error} = useAxios('https://blogs-app-p47g.onrender.com/api/blogs/details',{ 'blogId': location.state.id})
    const handleDelete =() => {
        let token = localStorage.getItem('user')
        axios.post('https://blogs-app-p47g.onrender.com/api/blogs/delete',{ blogId:location.state.id},{
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            }
        })
        .then(()=>{
            navigate('/home')
        })
        .catch(()=>{
            alert("Cannot delete")
        })
    }
    return ( 
        <>
        <Navbar/>
        <div className="blog-details">
            { isLoading && <div>Loading...</div> }
            { error && <div>{ error }</div> }
            { blog && (
              <article>
                <h2>{ blog.blog.title }</h2>
                <div>{ blog.blog.body }</div>
                <button onClick={handleDelete}>Delete</button>
              </article>
            )}
        </div>
        </>
     );
}
 
export default BlogDetails;