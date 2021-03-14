const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const Admin = mongoose.mongo.Admin
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.json({
    extended: true
}))
app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

const User = require('./models/User')
const UserAction = require('./modules/userAction')

// Создать БД и реализовать подключение к ней
async function start() {
    try {
        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
       
        const userChangeStream = User.watch();
        io.sockets.on('connection', socket => {

            //#region UserAction
            var userAction = new UserAction(socket,userChangeStream)
         
            userAction.subscribeToEvents()
            userAction.getUser()        
            //#endregion UserAction


            //#region EventAction


            
            //#endregion EventAction



        })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()