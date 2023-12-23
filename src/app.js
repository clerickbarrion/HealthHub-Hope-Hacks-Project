const express = require('express')
const path = require('path')
const connectChat = require('./utils/chat.js')
const app = express()
const database = require('./utils/database.js')
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

connectChat(app.listen(3000))

app.get('/login', async (req,res)=>{
    const result = await database.logIn(req.query.username,req.query.password).catch(err=>err)
    res.write(JSON.stringify(result))
    res.end()
})

app.post('/signUp', async (req,res)=>{
    const result = await database.signUp(req.body.username,req.body.password,req.body.middlename,req.body.hex).catch(err=>err)
    res.write(JSON.stringify(result))
    res.end()
})

app.patch('/resetPassword', async (req,res)=>{
    const result = await database.resetPassword(req.body.username,req.body.password,req.body.middlename).catch(err=>err)
    res.write(JSON.stringify(result))
    res.end()
})