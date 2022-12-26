import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import useAxios from "./useAxios";

const BlogDetails = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { data:blog, isLoading, error} = useAxios('http://localhost:5000/api/blogs/details',{ blogId: location.state.id})
    const handleDelete =() => {
        axios.post('http://localhost:5000/api/blogs/delete',{ blogId:location.state.id})
        .then(()=>{
            navigate('/')
        })
        .catch(()=>{
            alert("Cannot delete")
        })
    }
    return ( 
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
     );
}
 
export default BlogDetails;