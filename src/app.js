const express = require('express')
const path = require('path')
const connectChat = require('./utils/chat.js')
const app = express()
const database = require('./utils/database.js')
const homecareAPI = require('./utils/homecare.js')
const apimedic = require('./utils/apimedic.js')



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

app.get('/apimedic/getToken', async (req,res)=>{
    const result = await apimedic.getToken()
    res.write(JSON.stringify(result))
    res.end()
})

app.get('/apimedic/getSymptomsList', async (req,res)=>{
    const result = await apimedic.getSymptomsList()
    res.write(JSON.stringify(result))
    res.end()
})

app.get('/apimedic/getDiagnosisList', async (req,res)=>{
    const result = await apimedic.getDiagnosisList()
    res.write(JSON.stringify(result))
    res.end()
})

app.get('/apimedic/getRemedy', async (req,res)=>{
    const result = await apimedic.getRemedy(req.query.diagnosis)
    res.write(JSON.stringify(result))
    res.end()
})

app.get('/api/homecare', async (req,res)=>{
    const result = await homecareAPI(req.query.search)
    res.write(JSON.stringify(result))
    res.end()
})

app.post('/uploadHistory', (req,res)=>{
    database.uploadHistory(req.body.username,req.body.diagnosis,req.body.diagnosisId)
    res.end()
})

app.get('/retrieveHistory', async (req,res)=>{
    const result = await database.retrieveHistory(req.query.username)
    res.write(JSON.stringify(result))
    res.end()
})

app.delete('/removeDiagnosis', async (req,res)=>{
    database.removeDiagnosis(req.body.username,req.body.diagnosisID)
})

const feelingData = require('./utils/advice.json')
const fs = require('fs')



app.get('/feeling', (req, res) => {
res.write(fs.readFileSync('src/utils/advice.json').toString())
})