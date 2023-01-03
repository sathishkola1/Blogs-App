import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const ChangePassword = () => {
    const [otp, setOtp] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState('')
    let navigate = useNavigate()
    let url = process.env.REACT_APP_ENVIRONMENT == "PRODUCTION" ? "https://blogs-app-p47g.onrender.com" : "http://localhost:5000"

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        let userId = localStorage.getItem('userId')
        if (password != confirmPassword) {
            setIsLoading(false)
        }
        else {
            try {
                let {status} = await axios.post(`${url}/api/user/new-password`, {
                    "otp": otp,
                    "password": password,
                    "userId": userId
                })
                setIsLoading(false)
                if(status!==200){
                    throw "Error"
                }
                localStorage.removeItem('userId')
                navigate('/',{replace:true})
            }
            catch(err){
                setIsLoading(false)
                alert("Invalid details")
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
            <div className="create">
                <h2 id="logIn">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <label>Otp</label>
                    <input
                        type="password"
                        required
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value) }}
                    />
                    <label>New Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <label id="errorMsg">Confirm New Password<div>{isError}</div></label>
                    <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => { passwordValidation(e) }}
                    />
                    {!isLoading && <button id="registerButton">Change Password</button>}
                    {isLoading && <button id="registerButton" disabled>Please wait...</button>}
                </form>
                <div id="goBack">
                    Go back to home page?<Link id="clickHere" to="/">Click here</Link>
                </div>
            </div>

        </>
    );
}

export default ChangePassword;