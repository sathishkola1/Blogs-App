let jwt=require('jsonwebtoken')
const {db} = require('../db')

let auth=async(req,res,next)=>{
    try {
        let token=req.header('Authorization').replace('Bearer ','')
        let decoded=jwt.verify(token,process.env.JWT_SECRET)
        let query = 'SELECT name,users.user_id FROM users JOIN tokens ON users.user_id=tokens.user_id WHERE users.user_id=? AND token=?'
        let params = [decoded.id,token]
        let results = await db.promise(query, params)
        results = JSON.parse(JSON.stringify(results))
        if(results.length==0){
            throw new Error()
        }
        req.token=token
        req.User=results[0]
        next()
    } catch (error) {
        // console.log(error)
        res.status(401).send({error:"Please Authenticate"})
    }
}
module.exports=auth