const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const Admin = mongoose.mongo.Admin
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const cron = require('node-cron')
let shell = require('shelljs')

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

const Event = require('./models/Event')
const EventAction = require('./modules/eventAction')

const Notification = require('./models/Notification')
const NotificationActions = require('./modules/notificationActions')


async function start() {
    try {
        var date = moment().format('D.M.Y')
        var time = moment().format('H:mm')

        console.log(date + " " + time)

        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        const userChangeStream = User.watch();
        const eventChangeStream = Event.watch();
        const notificationChangeStream = Notification.watch();

        // cron.schedule('*/30 * * * * *', function(){
    
        //     console.log('Scheduler running...')
            
        //     if(shell.exec('node modules/cronAction.js').code !== 0){
        //         console.log('Something went wrong')
        //     }
        
        // })


        io.sockets.on('connection', socket => {

                    socket.on('enter', userId => {

                        var userAction = new UserAction(socket, userChangeStream, userId)

                        userAction.subscribeToEvents()
                        userAction.getUser()

                        var eventAction = new EventAction(socket, eventChangeStream, userId)

                        eventAction.subscribeToEvents()
                        eventAction.getEvents()

                        var notificationAction = new NotificationActions(socket, notificationChangeStream, userId)

                        notificationAction.subscribeToNotifications()
                        notificationAction.getNotifications()
                    })
        })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()