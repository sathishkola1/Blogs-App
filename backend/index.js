const express = require('express')
const cors = require("cors")
const bcrypt=require('bcryptjs')
const app = express()
require('dotenv').config()
const {db} = require('./db')
let path=require('path')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')

app.use(express.static(path.join(__dirname, '../blogs/build')))
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())

const generateAuthToken = async(id)=>{
    try{
    let token = jwt.sign({id},process.env.JWT_SECRET)
    let query = 'UPDATE users SET token=? WHERE user_id=?'
    let params = [token,id]
    await db.promise(query, params)
    return token
    }
    catch(err){
        console.log(err)
        throw "Cannot generate token"
    }
}

app.post('/api/user/signup',async(req,res)=>{
    try{
        const { name,email,password } = req.body
        let hashedPassword= await bcrypt.hash(password,8)
        let query = 'INSERT INTO users(user_id,name,email,password) VALUES(UUID(),?,?,?)'
        let params = [name,email,hashedPassword]
        await db.promise(query, params)
        res.status(201).send({msg:"created successfully"})
    }
    catch(err){
        console.log(err)
        res.status(400).send({Error:"Unable to register!"})
    }
})

app.post('/api/user/login',async(req,res)=>{
    try{
        const { email,password } = req.body
    let query = 'SELECT user_id,password FROM users WHERE email=?'
    let params = [email]
    let results = await db.promise(query, params)
    results = JSON.parse(JSON.stringify(results))
    if(results.length == 0){
        throw "Invalid email"
    }
    const isMatch = await bcrypt.compare(password,results[0].password)
    if(!isMatch){
        throw "Invalid password"
    }
    let token =await generateAuthToken(results[0].user_id)
    res.send({token})
    }
    catch(err){
        res.status(400).send({Error:"Cannot login"})
    }
})

app.get('/api/blogs',auth,async(req,res)=>{
    const userId = req.User.user_id
    try {
        let query = 'SELECT blog_id,title FROM blogs WHERE user_id=?'
        let params = [userId]
        let results = await db.promise(query, params)
        results = JSON.parse(JSON.stringify(results))
        res.send({
            blogs : results
        })

    } catch (error) {
        // console.log(error)
        res.status(400).send({Error:"Cannot fetch blogs"})
    }
})

app.post('/api/blogs/details',auth,async(req,res)=>{
    try{
        const blogId = req.body.blogId
        let query = 'SELECT title,body FROM blogs WHERE blog_id=?'
        let params= [blogId]
        let result = await db.promise(query, params)
        result = JSON.parse(JSON.stringify(result))
        if(!result.length)
        {
              throw "Invalid Id"
        }
        res.send({
            blog:result[0]
        })
    }
    catch(err){
        res.status(500).send({msg:"Cannot fetch details"})
    }
})

app.post('/api/blogs/create',auth,async(req,res)=>{
    const userId = req.User.user_id
    try{
        const { title,body } = req.body
        let query = 'INSERT INTO blogs(blog_id,title,body,user_id) VALUES(UUID(),?,?,?)'
        let params = [title,body,userId]
        await db.promise(query,params)
        res.status(201).send({msg:"Created successfully"})
    }
    catch(err){
        res.status(400).send({Error:"Cannot create"})
    }
})

app.post('/api/blogs/delete',auth,async(req,res)=>{
    const blogId = req.body.blogId
    try{
        let query = 'DELETE FROM blogs WHERE blog_id=?'
        let params= [blogId]
        await db.promise(query,params)
        res.send({msg:"Deleted successfully"})
    }
    catch(err){
        res.status(500).send({Error:"Cannot delete"})
    }
})

app.post('/api/user/logout',auth,async(req,res)=>{
    const userId = req.User.user_id
    const token = null
    try{
        let query = 'UPDATE users SET token=? WHERE user_id=?'
        let params = [token,userId]
        await db.promise(query,params)
        res.send({msg:"Logged out"})
    }
    catch(err){
        res.status(400).send({Error:"Cannot logout"})
    }
})

app.get('/api/user/verify',auth,async(req,res)=>{
    try{
    res.send({msg:"Authentication successfull"})
    }
    catch(err){
        res.status(400).send({Error:"Error Authenticating!"})
    }
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../blogs/build/index.html'));
})

app.listen(PORT,()=>{
    console.log("Server succefully started on port" +PORT)
})
