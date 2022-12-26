const express = require('express')
let cors = require("cors");
const app = express()
require('dotenv').config()
const {db} = require('./db')
let path=require('path')

app.use(express.static(path.join(__dirname, '../blogs/build')))
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())
app.get('/api/blogs',async(req,res)=>{
    try {
        let query = 'SELECT blog_id,title FROM blogs'
        let params
        let results = await db.promise(query, params)
        results = JSON.parse(JSON.stringify(results))
        res.send({
            blogs : results
        })

    } catch (error) {
        res.status(400).send({Error:"Cannot fetch blogs"})
    }
})

app.post('/api/blogs/details',async(req,res)=>{
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

app.post('/api/blogs/create',async(req,res)=>{
    try{
        const { title,body } = req.body
        let query = 'INSERT INTO blogs(blog_id,title,body) VALUES(UUID(),?,?)'
        let params = [title,body]
        await db.promise(query,params)
        res.status(201).send({msg:"Created successfully"})
    }
    catch(err){
        res.status(400).send({Error:"Cannot create"})
    }
})

app.post('/api/blogs/delete',async(req,res)=>{
    try{
        const blogId = req.body.blogId
        let query = 'DELETE FROM blogs WHERE blog_id=?'
        let params= [blogId]
        await db.promise(query,params)
        res.send({msg:"Deleted successfully"})
    }
    catch(err){
        res.status(500).send({Error:"Cannot delete"})
    }
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../blogs/build/index.html'));
})

app.listen(PORT,()=>{
    console.log("Server succefully started on port" +PORT)
})
