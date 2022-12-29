import BlogList from './bloglist';
import useAxios from './useAxios';
import Navbar from './navbar'

const Home = () => {
    let url = process.env.ENVIRONMENT=="PRODUCTION"?"https://blogs-app-p47g.onrender.com":"http://localhost:5000"
    const { data , isLoading , error } = useAxios(`${url}/api/blogs`)

    return (
        <>
        <Navbar/>
        
        <div className="home">
            {error && <div>{error}</div>}
            {isLoading && <div>Loading...</div>}
            {data && <BlogList blogs={data.blogs}/>}
        </div>
        </>
    );
}
 
export default Home;