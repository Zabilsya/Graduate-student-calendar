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

        cron.schedule('* * * * *', function(){
    
            console.log('Scheduler running...')
            
            const currentDt = new Date(moment().format().slice(0, -8) + '00').toISOString()

            async function getEventsSheduled() {
                console.log('го')
                const sheduledEvents = await Event.find({
                    "nextNotifficationDt": currentDt
                })
                return sheduledEvents
            }
            
            async function getEventsUrgent() {
            
                const urgentEventStartDt = new Date(moment(currentDt).add(1,'hour')).toISOString()
                
                const urgentEvents = await Event.find({
                    "startDt": urgentEventStartDt
                })
                return urgentEvents
            }
            
            function getEventIds(sheduledEvents, urgentEvents) {
                const eventIds = Array()
                const allEvents = sheduledEvents.concat(urgentEvents)
                allEvents.forEach(function(element) {
                    eventIds.push(element._id)
                })
                return eventIds
            }
            
            async function deleteOldNotifications(sheduledEvents, urgentEvents) {
                const eventIds = getEventIds(sheduledEvents, urgentEvents)
                await Notification.deleteMany({
                    "eventId": {
                        $in: eventIds
                    },
                    "type": "remind",
                })
            }
            
            async function createNewNotifications(sheduledEvents, urgentEvents) {
            
                let newNotification 
                
                sheduledEvents.forEach(async element =>{
            
                    const millisecondsInHour = 86400000
                    const daysLeft = ( moment(element.startDt) - moment(currentDt) ) / millisecondsInHour
            
                    newNotification = new Notification({
                        target: element.target,
                        eventId: element._id,
                        eventName: element.name,
                        createDt: currentDt,
                        type: 'remind',
                        daysLeft: daysLeft
                    })
            
                    await newNotification.save()
                })
            
                urgentEvents.forEach(async element => {
            
                    newNotification = new Notification({
                        target: element.target,
                        eventId: element._id,
                        eventName: element.name,
                        createDt: currentDt,
                        type: 'remind',
                        daysLeft: 0
                    })
                    
                    await newNotification.save()
                })
            }
            
            async function startCron() {
                const sheduledEvents = await getEventsSheduled()
                const urgentEvents = await getEventsUrgent()
                if(sheduledEvents || urgentEvents){
                    await deleteOldNotifications(sheduledEvents, urgentEvents)
                    await createNewNotifications(sheduledEvents, urgentEvents)
                }
            }
            
            startCron()            
        
        })


    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()