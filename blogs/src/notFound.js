import { Link } from "react-router-dom";

const NotFound = () => {
    return ( 
        <div className="notFound">
            <h2>404.Page Not Found</h2>
            <Link to='/'>
                Back to HomePage...
            </Link>
        </div>
     );
}
 
export default NotFound;