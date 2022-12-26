import { useState,useEffect } from "react"
import axios from 'axios'
const useAxios = (url,body) => {
    const [data,setData] = useState(null)
    const [isLoading,setisLoading] = useState(true)
    const [error,setError] = useState(null)

    useEffect(()=> {
      let promise
      if(body){ 
        promise = axios.post(url,body)
      }
      else{
        promise = axios.get(url)
      }
      promise.then((data) => {
        setData(data.data)
        setisLoading(false)
        setError(null)
        })
        .catch((err) => {
                setisLoading(false)
                setError(err.message)
                setData(null)
        })

    },[url])

    return { data, isLoading, error, setError }
}
 
export default useAxios