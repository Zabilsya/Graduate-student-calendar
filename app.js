const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

// Создать БД и реализовать подключение к ней 
async function start() {
    try {
        await mongoose.connect(config.get('mongo'))
    }
    catch {}
}

app.listen(PORT, () => console.log(`PORT: ${PORT}`))
