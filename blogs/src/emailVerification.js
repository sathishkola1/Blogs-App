import axios from "axios";
import { useState } from "react";
import LayoutNav from "./layoutNav";
import { useNavigate } from "react-router-dom";

const EmailVerification = () => {
    const [email,setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    let navigate = useNavigate()
    let url = process.env.REACT_APP_ENVIRONMENT=="PRODUCTION"?"https://blogs-app-p47g.onrender.com":"http://localhost:5000"

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setIsLoading(true)

        try{
            let {data,status}= await axios.post(`${url}/api/user/forgot-password`,{
                'email':email
            })
            setIsLoading(false)
            if(status!==200){
                throw "Error"
            }
            let userId = data.userId
            localStorage.setItem('userId',userId)
            navigate('/changePassword',{replace:true})
        }
        catch(err){
            setIsLoading(false)
            localStorage.removeItem('userId')
            alert('Invalid credentials')
        }
    }

    return ( 
        <>
        <LayoutNav/>
        <div className="create">
                <h2 id="logIn">Email Verification</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />
                    {!isLoading && <button>Send Otp</button>}
                    {isLoading && <button disabled>Please wait...</button>}
                </form>
            </div>
            </>
     );
}
 
export default EmailVerification;