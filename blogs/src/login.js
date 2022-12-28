import { useState } from "react"
import LayoutNav from "./layoutNav"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            let { data } = await axios.post(
                'https://blogs-app-p47g.onrender.com/api/user/login',
                { 'email': email, 'password': password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            setIsLoading(false)
            let token = data.token
            localStorage.setItem('user', token)
            navigate('/home', { replace: true })
        }
        catch (err) {
            setIsLoading(false)
            navigate('/', { replace: true })
            alert("Invalid credentials")
        }
    }

    return (
        <>
            <LayoutNav />
            <div className="create">
                <h2 id="logIn">Log In</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    {!isLoading && <button>LogIn</button>}
                    {isLoading && <button disabled>Please wait...</button>}
                </form>
                <div className="footer">
                    Don't Have an account?<Link id="signIn" to="/Register">Register</Link>
                </div>
            </div>
        </>
    );
}

export default Login;