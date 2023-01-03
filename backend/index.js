const express = require('express')
const cors = require("cors")
const bcrypt = require('bcryptjs')
const app = express()
require('dotenv').config()
const { db } = require('./db')
let path = require('path')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')
const mailSender = require('./mailsender')
const otpGenerator = require('otp-generator')
const { v4: uuidv4 } = require('uuid')

app.use(express.static(path.join(__dirname, '../blogs/build')))
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())


const generateAndStoreAuthToken = async (userId) => {
    try {
        let token = jwt.sign({ id:userId }, process.env.JWT_SECRET)
        let query = 'INSERT INTO tokens(user_id,token) VALUES(?,?)'
        let params = [userId,token]
        await db.promise(query, params)
        return token
    }
    catch (err) {
        console.log(err)
        throw "Cannot generate token"
    }
}

app.post('/api/user/signup', async (req, res) => {
    try {
        let userId 
        let { name, email, password } = req.body
        // find if account exist with given email
        let query = 'SELECT * FROM users WHERE email=?'
        let params = [email]
        let results = await db.promise(query, params)
        results = JSON.parse(JSON.stringify(results))
        // if account exists and verified
        if (results.length !== 0 && results[0].verified == true) {
            throw "Account already exists with this email!"
        }
        let otp
        // create account
        if (results.length == 0) {
            userId = uuidv4()
            let hashedPassword = await bcrypt.hash(password, 8)
            query = 'INSERT INTO users(user_id,name,email,password) VALUES(?,?,?,?)'
            params = [userId, name, email, hashedPassword]
            await db.promise(query, params)
        }
        // use existing account
        else{
            userId = results[0].user_id
            let hashedPassword = await bcrypt.hash(password, 8)
            query = 'UPDATE users SET name=?,password=? WHERE user_id=?'
            params = [name, hashedPassword,userId]
            await db.promise(query, params)
        }

        // delete existing otps if any
        query = 'DELETE FROM otps WHERE user_id=?'
        params = [userId]
        await db.promise(query, params)
        // create new otp
        otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, })
        query = 'INSERT INTO otps(user_id,otp) VALUES (?,?)'
        params = [userId, otp]
        await db.promise(query, params)
        // mail otp
        await mailSender.sendOtp(email, otp)
        res.status(201).send({ msg: "otp sent successfully", userId})
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ Error: "Unable to register!" })
    }
})

app.post('/api/user/login', async (req, res) => {
    try {
        const { email, password } = req.body
        // find if verified account exists
        let query = 'SELECT user_id,password FROM users WHERE email=? AND verified=?'
        let params = [email,true]
        let results = await db.promise(query, params)
        results = JSON.parse(JSON.stringify(results))
        if (results.length == 0) {
            throw "Account not found!"
        }
        // check if password matches
        const isMatch = await bcrypt.compare(password, results[0].password)
        if (!isMatch) {
            throw "Invalid password"
        }
        // generate jwt token
        let token = await generateAndStoreAuthToken(results[0].user_id)
        res.send({ token })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ Error: "Cannot login" })
    }
})

app.get('/api/blogs', auth, async (req, res) => {
    const userId = req.User.user_id
    try {
        let query = 'SELECT blog_id,title FROM blogs WHERE user_id=?'
        let params = [userId]
        let results = await db.promise(query, params)
        results = JSON.parse(JSON.stringify(results))
        res.send({
            blogs: results
        })

    } catch (error) {
        res.status(400).send({ Error: "Cannot fetch blogs" })
    }
})

app.post('/api/blogs/details', auth, async (req, res) => {
    try {
        const blogId = req.body.blogId
        let query = 'SELECT title,body FROM blogs WHERE blog_id=?'
        let params = [blogId]
        let result = await db.promise(query, params)
        result = JSON.parse(JSON.stringify(result))
        if (!result.length) {
            throw "Invalid Id"
        }
        res.send({
            blog: result[0]
        })
    }
    catch (err) {
        res.status(500).send({ msg: "Cannot fetch details" })
    }
})

app.post('/api/blogs/create', auth, async (req, res) => {
    const userId = req.User.user_id
    try {
        const { title, body } = req.body
        let query = 'INSERT INTO blogs(blog_id,title,body,user_id) VALUES(UUID(),?,?,?)'
        let params = [title, body, userId]
        await db.promise(query, params)
        res.status(201).send({ msg: "Created successfully" })
    }
    catch (err) {
        res.status(400).send({ Error: "Cannot create" })
    }
})

app.post('/api/blogs/delete', auth, async (req, res) => {
    const blogId = req.body.blogId
    try {
        let query = 'DELETE FROM blogs WHERE blog_id=?'
        let params = [blogId]
        await db.promise(query, params)
        res.send({ msg: "Deleted successfully" })
    }
    catch (err) {
        res.status(500).send({ Error: "Cannot delete" })
    }
})

app.post('/api/user/logout', auth, async (req, res) => {
    const userId = req.User.user_id
    const token = req.token
    try {
        let query = 'DELETE FROM tokens WHERE user_id=? AND token=?'
        let params = [userId,token]
        await db.promise(query, params)
        res.send({ msg: "Logged out" })
    }
    catch (err) {
        res.status(400).send({ Error: "Cannot logout" })
    }
})

app.get('/api/user/verify', auth, async (req, res) => {
    try {
        res.send({ msg: "Authentication successfull" })
    }
    catch (err) {
        res.status(400).send({ Error: "Error Authenticating!" })
    }
})

app.post('/api/user/register-otp', async (req, res) => {
    try {
        const userId = req.body.userId
        const userOtp = req.body.otp
        let query1 = 'SELECT otp FROM otps WHERE user_id=?'
        let params1 = [userId]
        let results = await db.promise(query1, params1)
        results = JSON.parse(JSON.stringify(results))
        let dbOtp = results[0].otp
        if (results.length == 0) {
            throw "otp not found"
        }
        if (userOtp !== dbOtp) {
            throw "otp not valid"
        }
        let query2 = 'UPDATE users SET verified=? WHERE user_id=?'
        let params2 = [true, userId]
        await db.promise(query2, params2)
        let query3 = 'DELETE FROM otps where user_id=?'
        let params3 = [userId]
        await db.promise(query3, params3)
        res.send({ msg: "successfull" })
    }
    catch (err) {
        console.log(err)
        res.status(400).send({ Error: "Invalid otp" })
    }
})

app.post('/api/user/forgot-password',async(req,res)=>{
    try{
    let email = req.body.email
    let query = 'SELECT user_id,verified FROM users WHERE email=?'
    let params = [email]
    let results = await db.promise(query,params)
    results = JSON.parse(JSON.stringify(results))
    if(results.length==0 || results[0].verified==false){
        throw "Account doesn't exist with given email"
    }
    let userId = results[0].user_id
    query = 'SELECT * FROM forgot_otps'
    params = []
    results = await db.promise(query,params)
    results = JSON.parse(JSON.stringify(results))
    if(results.length!==0){
        query = 'DELETE FROM forgot_otps'
        params = []
        await db.promise(query,params)
    }
    let otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, })
    query = 'INSERT INTO forgot_otps(user_id,forgot_otp) VALUES (?,?)'
    params = [userId, otp]
    await db.promise(query, params)
    await mailSender.sendOtp(email, otp)
    res.send({userId})
    }
    catch(err){
        console.log(err)
        res.status(400).send({msg:"Cannot send otp"})
    }
})


app.post('/api/user/new-password',async(req,res)=>{
    try{
        const userId = req.body.userId
        const userOtp = req.body.otp
        let query1 = 'SELECT forgot_otp FROM forgot_otps WHERE user_id=?'
        let params1 = [userId]
        let results = await db.promise(query1, params1)
        results = JSON.parse(JSON.stringify(results))
        let dbOtp = results[0].forgot_otp
        if (results.length == 0) {
            throw "otp not found"
        }
        if (userOtp !== dbOtp) {
            throw "otp not valid"
        }
        let query2 = 'DELETE FROM forgot_otps where user_id=?'
        let params2 = [userId]
        await db.promise(query2, params2)
        let password = req.body.password
        let hashedPassword = await bcrypt.hash(password,8)
        let query3 = 'UPDATE users SET password=? WHERE user_id=?'
        let params3 = [hashedPassword,userId]
        await db.promise(query3,params3)
        res.send({msg:"Password changed successfully"})
    }
    catch(err){
        res.status(400).send({msg:"Cannot change password"})
    }
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../blogs/build/index.html'));
})

app.listen(PORT, () => {
    console.log("Server succefully started on port" + PORT)
})