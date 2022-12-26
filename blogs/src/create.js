import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Create = () => {
    const [title,setTitle] = useState('')    
    const [body,setBody] = useState('')
    // const [author,setAuthor] = useState('mario')
    const [isLoading,setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const blog = { title,body }
        axios.post('http://localhost:5000/api/blogs/create',blog)
        .then(()=>{
            setIsLoading(false)
            navigate('/')
        })
        .catch((err)=>{
            alert("Cannot create blog")
        })
    }

    return ( 
        <div className="create">
            <h2>New Blog</h2>
            <form onSubmit={handleSubmit}>
                <label>Blog Title:</label>
                <input 
                  type="text"
                  required
                  value={ title }
                  onChange={(e)=>{ setTitle(e.target.value) }}
                />
                <label>Blog Body:</label>
                <textarea 
                  required
                  value={ body }
                  onChange={(e)=>{ setBody(e.target.value) }}
                  ></textarea>
                {/* <label>Blog Author:</label>
                <select
                 value={ author }
                 onChange={ (e) =>{ setAuthor(e.target.value) } }
                > 
                    <option value="mario">mario</option>  
                    <option value="yoshi">yoshi</option>  
                </select> */}
                  { !isLoading && <button>Add Blog</button>}
                  { isLoading && <button disabled>Adding Blog...</button>}
            </form>
        </div>
     );
}
 
export default Create
