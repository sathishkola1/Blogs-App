import BlogList from './bloglist';
import useFetch from './useAxios';

const Home = () => {
    const { data , isLoading , error } = useFetch('https://blogs-app-p47g.onrender.com/api/blogs')

    return (
        <div className="home">
            {error && <div>{error}</div>}
            {isLoading && <div>Loading...</div>}
            {data && <BlogList blogs={data.blogs}/>}
        </div>
    );
}
 
export default Home;