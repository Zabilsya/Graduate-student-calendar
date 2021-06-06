const moment = require('moment')
const Event = require('./../models/Event')
const User = require('./../models/User')
const Notification = require('./../models/Notification')
const {
    all
} = require('../routes/auth.routes')

const currentDt = new Date(moment().format().slice(0, -8) + '00').toISOString()

async function getEventsSheduled() {
    console.log('го')
    const sheduledEvents = await Event.find({
        "nextNotifficationDt": currentDt
    })
    console.log('ура')
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
    const allEvents = Array(sheduledEvents.concat(urgentEvents))
    allEvents.forEach(function(element) {
        console.log(typeof element._id)
        eventIds.push(element._id)
    })
    return eventIds
}

async function deleteOldNotifications(sheduledEvents, urgentEvents) {
    const eventIds = getEventIds(sheduledEvents, urgentEvents)
    await Notification.deleteMany({
        "eventId": {
            $in: eventIds
        }
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

async function start() {
    const sheduledEvents = await getEventsSheduled()
    const urgentEvents = await getEventsUrgent()
    if(sheduledEvents || urgentEvents){
        await deleteOldNotifications(sheduledEvents, urgentEvents)
        await createNewNotifications(sheduledEvents, urgentEvents)
    }
}

start()


