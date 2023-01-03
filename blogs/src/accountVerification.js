import { useState } from "react";
import LayoutNav from "./layoutNav";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";

const AccountVerification = () => {
    const [otp,setOtp] = useState('')
    const [isLoading,setIsLoading] = useState(false)
    let navigate = useNavigate()
    let url = process.env.REACT_APP_ENVIRONMENT == "PRODUCTION" ? "https://blogs-app-p47g.onrender.com" : "http://localhost:5000"

    const handleSubmit=async(e)=>{
        let userId = localStorage.getItem("userId")
        e.preventDefault()
        setIsLoading(true)
        try{
        let data = await axios.post(`${url}/api/user/register-otp`,{
            "otp":otp,
            "userId":userId
        })
        setIsLoading(false)
        navigate('/',{replace:true})
        }
        catch(err){
            setIsLoading(false)
            alert("Invalid otp")
        }
    }

    return ( 
     
        <div className="create otpVerify">
                <h2 id="logIn">Verify Otp</h2>
                <form onSubmit={handleSubmit}>
                    {/* <label>Otp</label> */}
                    <input
                        type="password"
                        required
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value) }}
                    />
                    {!isLoading && <button>Verify</button>}
                    {isLoading && <button disabled>Please wait...</button>}
                </form>
                <div id="goBack">
                    Go back to home page?<Link id="clickHere" to="/">Click here</Link>
                </div>
            </div>
     );
}
 
export default AccountVerification;