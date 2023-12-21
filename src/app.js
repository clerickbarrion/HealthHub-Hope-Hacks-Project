const express = require('express')
const path = require('path')
const connectChat = require('./utils/chat.js')
const app = express()

app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

connectChat(app.listen(3000))