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
    const [isError, setIsError] = useState('')
    let navigate = useNavigate()
    let url = process.env.REACT_APP_ENVIRONMENT=="PRODUCTION"?"https://blogs-app-p47g.onrender.com":"http://localhost:5000"

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        if (password != confirmPassword) {
            setIsLoading(false)
        } else {
            try{
            let {data} = await axios.post(
                `${url}/api/user/signup`,
                { 'email': email, 'password': password, 'name': name })
            localStorage.setItem('userId',data.userId)
            setIsLoading(false)
            navigate('/accountVerification', { replace: true })
            }
           catch(err){
                setIsLoading(false)
                navigate('/register', { replace: true })
            }
        }
    }

    const passwordValidation=(e)=>{
        const confPass = e.target.value
        setConfirmPassword(confPass)
        if(password!=confPass){
            setIsError('Passwords do not match!')
        }
        else{
            setIsError('')
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
                    <label id="errorMsg">Confirm Passowrd<div>{isError}</div></label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => { passwordValidation(e) }}
                    />
                    {!isLoading && <button id="registerButton">Register</button>}
                    {isLoading && <button id="registerButton" disabled>Registering...</button>}
                </form>
                <div className="footer">
                    Have an account?<Link id="signIn" to="/">Sign In</Link>
                </div>
            </div>
        </>
    );
}

export default Register;