const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

// app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

// Создать БД и реализовать подключение к ней
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        io.sockets.on('connection', socket => {

            // получаем в response id пользователя
            socket.on('enter', response => {

            })
            socket.on('mes', mes => {
                console.log(mes)
                socket.emit('mes', `${mes} privet client`)
            })
        })

    }
    catch (e){
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()