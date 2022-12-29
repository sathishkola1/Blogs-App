import { useState } from "react"
import LayoutNav from "./layoutNav"
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    let navigate = useNavigate()
    let url = process.env.REACT_APP_ENVIRONMENT=="PRODUCTION"?"https://blogs-app-p47g.onrender.com":"http://localhost:5000"

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        if (password != confirmPassword) {
            setIsLoading(false)
            alert('Passwords do not match')
        } else {
            try{
            let data = await axios.post(
                `${url}/api/user/signup`,
                { 'email': email, 'password': password, 'name': name },
                {
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            )
            setIsLoading(false)
            navigate('/', { replace: true })
            }
           catch(err){
                setIsLoading(false)
                navigate('/register', { replace: true })
            }
        }
    }

    return (
        <>
            <LayoutNav />
            <div className="create">
                <h2 id="register">Register</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                    />
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
                    <label>Confirm Passowrd</label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value) }}
                    />
                    {!isLoading && <button>Register</button>}
                    {isLoading && <button disabled>Registering...</button>}
                </form>
                <div className="footer">
                    Have an account?<Link id="signIn" to="/">Sign In</Link>
                </div>
            </div>
        </>
    );
}

export default Register;