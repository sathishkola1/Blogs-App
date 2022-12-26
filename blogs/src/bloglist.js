import { useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'

const BlogList = ({blogs}) => {
    let navigate = useNavigate()

    function handleClick(id){
        navigate('/blogs',{ replace:true,state: {id} })
    }
    return (
        
        <div className="blog-list">
            {!blogs.length && <div>No blogs found! Please create</div> }
            {blogs.map((blog) => (
                <div className='blog-preview' key={blog.blog_id} onClick={()=>{handleClick(blog.blog_id)}}>
                    
                    <h2>{blog.title}</h2>
                 
                </div>
            ))}
        </div>
    );
}
 
export default BlogList