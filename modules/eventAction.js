const moment = require('moment')
const Event = require('./../models/Event')
const User = require('./../models/User')
const Notification = require('./../models/Notification')
const config = require('config')


module.exports = function (socket, eventChangeStream, userId) {

    let newNotification

    this.subscribeToEvents = function () {
        let deletedEvent;

        eventChangeStream.on("change", async (change) => {

            const eventId = change.documentKey._id

            switch (change.operationType) {
                case "insert":

                    const newEvent = {
                        _id: eventId,
                        name: change.fullDocument.name,
                        description: change.fullDocument.description,
                        startDt: change.fullDocument.startDt,
                        priority: change.fullDocument.priority,
                        type: change.fullDocument.type,
                        notificationPeriod: change.fullDocument.notificationPeriod,
                        info: change.fullDocument.info,
                        nextNotifficationDt: change.fullDocument.nextNotifficationDt,
                        target: change.fullDocument.target
                    }
                    

                    if (userId == config.get('superuserId') || (userId == newEvent.target)) {
                        socket.emit("newEvent", newEvent)

                    } else if (newEvent.target.lenght == 'YYYY'.length) {

                        const user = await User.findOne({
                            "_id": userId
                        })

                        const admissionYear = user.admissionYear

                        if (admissionYear == newEvent.target) {
                            socket.emit("newEvent", newEvent)
                        }

                    }

                    
                    break;

                case "delete":
                    socket.emit("deletedEvent", eventId)

                    // if (userId == config.get('superuserId') || (userId == deletedEvent.target)) {

                    //     socket.emit("deletedEvent", eventId)

                    // } else if (deletedEvent.target.lenght == 'YYYY'.length) {

                    //     const admissionYear = await User.findOne({
                    //         "_id": userId
                    //     }).admissionYear

                    //     if (admissionYear == deletedEvent.target) {
                    //         socket.emit("deletedEvent", eventId)
                    //     }
                    // }

                    break;


                case "update":

                    const updatedNextNotificationDt = change.updateDescription.updatedFields.nextNotifficationDt
                    const countUpdatedAttrs = Object.keys(change.updateDescription.updatedFields).length
                    const isCron = updatedNextNotificationDt && countUpdatedAttrs == 1

                    if (isCron) {
                        break;
                    }

                    const response = await Event.findOne({
                        "_id": eventId
                    })


                    const updatedEvent = {
                        _id: response._id,
                        name: response.name,
                        description: response.description,
                        startDt: response.startDt,
                        priority: response.priority,
                        type: response.type,
                        notificationPeriod: response.notificationPeriod,
                        info: response.info,
                        target: response.target
                    }
                    if (userId == config.get('superuserId') || (userId == response.target)) {

                        socket.emit("updatedEvent", updatedEvent)

                    } else if (response.target.lenght == 'YYYY'.length) {

                        const user = await User.findOne({
                            "_id": userId
                        })

                        const admissionYear = user.admissionYear

                        if (admissionYear == response.target) {
                            socket.emit("updatedEvent", updatedEvent)
                        }
                    }
                    break;
            }
        })

        socket.on('addEvent', async (newEvent) => {
            try {
                let {
                    name,
                    description,
                    startDt,
                    priority,
                    type,
                    notificationPeriod,
                    info,
                    target
                } = newEvent

                const notPeriod = Number(notificationPeriod)
                
                const momentTime = moment(startDt)
                startDt = new Date(momentTime.format().slice(0, -8) + '00').toISOString()

                const date = momentTime.add(notPeriod, 'days')

                const nextNotifficationDt = new Date(date.format().slice(0, -8) + '00').toISOString()

                const event = new Event({
                    name: name,
                    description: description,
                    startDt: startDt,
                    priority: priority,
                    type: type,
                    notificationPeriod: notPeriod,
                    info: info,
                    nextNotifficationDt: nextNotifficationDt,
                    target: target
                })
                
                await event.save()
                socket.emit('addEvent', 'Мероприятие успешно добавлено в систему!')

                // create notification
                const temp = await Event.findOne({"name": name, "startDt": startDt})
                const createDt = new Date(moment().format().slice(0, -8) + '00').toISOString()

                newNotification = new Notification({
                    target: temp.target,
                    eventId: temp._id.toString(),
                    eventName: temp.name,
                    createDt: createDt,
                    type: 'insert',
                    daysLeft: null,
                    viewers: []
                })
                
                await newNotification.save()
            } catch (e) {
                socket.emit('addEvent', 'Ошибка!')
            }
        })

        socket.on('deleteEvent', async (eventForDelete) => {
            try {
                const eventId = eventForDelete._id

                // delete all notifications
                await Notification.deleteMany({
                    "eventId": eventId
                })

                // create notification about deletion
                const createDt = new Date(moment().format().slice(0, -8) + '00').toISOString()

                newNotification = new Notification({
                    target: eventForDelete.target,
                    eventId: eventId,
                    eventName: eventForDelete.name,
                    createDt: createDt,
                    type: 'delete',
                    daysLeft: null,
                    viewers: []
                })

                deletedEvent = eventForDelete

                await newNotification.save()

                await Event.deleteOne({
                    "_id": eventId
                })
                socket.emit('deleteEvent', 'Мероприятие успешно удалено')
            } catch (e) {
                socket.emit('deleteEvent', 'Ошибка!')
            }
        })

        socket.on('updateEvent', async (eventForUpdate) => {
            const momentTime = moment(eventForUpdate.startDt)
            eventForUpdate.startDt = new Date(momentTime.format().slice(0, -8) + '00').toISOString()
            const date = momentTime.add(eventForUpdate.notificationPeriod, 'days')
            eventForUpdate.nextNotifficationDt = new Date(date.format().slice(0, -8) + '00').toISOString()

            const current = await Event.findOne({
                "_id": eventForUpdate._id
            })


            if (current.startDt.toISOString() == eventForUpdate.startDt &&
                current.name == eventForUpdate.name &&
                current.description == eventForUpdate.description &&
                current.priority == eventForUpdate.priority &&
                current.type == eventForUpdate.type &&
                current.notificationPeriod == eventForUpdate.notificationPeriod &&
                current.info == eventForUpdate.info) {
                socket.emit('updateEvent', 'Вы не внесли никаких изменений')
                return
            }

            try {
                await Event.updateOne({
                    "_id": eventForUpdate._id
                }, {
                    "name": eventForUpdate.name,
                    "description": eventForUpdate.description,
                    "startDt": eventForUpdate.startDt,
                    "priority": eventForUpdate.priority,
                    "type": eventForUpdate.type,
                    "notificationPeriod": eventForUpdate.notificationPeriod,
                    "info": eventForUpdate.info,
                    "nextNotifficationDt": eventForUpdate.nextNotifficationDt,
                    "target": eventForUpdate.target
                })
                socket.emit('updateEvent', 'Мероприятие успешно изменено')

                // Удалить уведомление об апдейте
                await Notification.deleteOne({
                    "eventId": eventForUpdate._id,
                    "type": "update"
                })


                // Создать новое уведомление об апдейте
                const createDt = new Date(moment().format().slice(0, -8) + '00').toISOString()

                newNotification = new Notification({
                    target: eventForUpdate.target,
                    eventId: eventForUpdate._id,
                    eventName: eventForUpdate.name,
                    createDt: createDt,
                    type: 'update',
                    daysLeft: null,
                    viewers: []
                })

                await newNotification.save()

            } catch (e) {
                socket.emit('updateEvent', 'Ошибка!')
            }
        })

    }
    this.getEvents = function () {
        socket.on('getEvents', async () => {
            let userEvents
            try {

                if (userId != config.get('superuserId')) {

                    const user = await User.findOne({
                        "_id": userId
                    })
                    
                    userEvents = await Event.find({
                        $or: [{
                                "target": user.admissionYear.toString()
                            },
                            {
                                "target": userId
                            }
                        ]
                    })

                } else {
                    userEvents = await Event.find()
                }
                socket.emit('getEvents', userEvents)
            } catch (e) {
                socket.emit('getEvents', 'Ошибка!')
            }
        })
    }
}