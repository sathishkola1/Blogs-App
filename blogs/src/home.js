import BlogList from './bloglist';
import useAxios from './useAxios';
import Navbar from './navbar'

const Home = () => {
    const { data , isLoading , error } = useAxios('https://blogs-app-p47g.onrender.com/api/blogs')

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