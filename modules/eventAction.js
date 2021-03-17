const moment = require('moment')
const Event = require('./../models/Event')
const User = require('./../models/User')
const config = require('config')


module.exports = function (socket, eventChangeStream, userId) {

    const socket = socket
    const eventChangeStream = eventChangeStream
    const userId = userId

    this.subscribeToEvents = function () {

        eventChangeStream.on("change", async (change) => {

            switch (change.operationType) {
                case "insert":

                    const newEvent = {
                        _id: change.fullDocument._id,
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

                        const admissionYear = await User.findOne({
                            "_id": userId
                        }).admissionYear

                        if (admissionYear == newEvent.target) {
                            socket.emit("newEvent", newEvent)
                        }
                    }

                    break;

                case "delete":

                    const response = await Event.findOne({
                        "_id": change.documentKey._id
                    })

                    if (userId == config.get('superuserId') || (userId == response.target)) {

                        socket.emit("deletedEvent", response.documentKey._id)

                    } else if (response.target.lenght == 'YYYY'.length) {

                        const admissionYear = await User.findOne({
                            "_id": userId
                        }).admissionYear

                        if (admissionYear == response.target) {
                            socket.emit("deletedEvent", response)
                        }
                    }
                    socket.emit("deletedEvent", change.documentKey._id);
                    break;


                case "update":

                    if (!change.updateDescription.updatedFields.nextNotifficationDatetime) {

                        const response = await Event.findOne({
                            "_id": change.documentKey._id
                        })


                        const updatedEvent = {
                            _id: response._id,
                            name: response.name,
                            description: response.description,
                            startDt: response.startDt,
                            priority: response.priority,
                            type: response.type,
                            notificationPeriod: response.notificationPeriod,
                            info: response.info
                        }
                        if (userId == config.get('superuserId') || (userId == response.target)) {

                            socket.emit("updatedEvent", updatedEvent)

                        } else if (response.target.lenght == 'YYYY'.length) {

                            const admissionYear = await User.findOne({
                                "_id": userId
                            }).admissionYear

                            if (admissionYear == response.target) {
                                socket.emit("updatedEvent", updatedEvent)
                            }
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
                priority = 2
                type = 'project'
                notificationPeriod = 2

                const momentTime = moment(startDt)
                startDt = new Date(momentTime.format().slice(0, -8) + '00').toISOString()

                const date = momentTime.add(notificationPeriod, 'days')

                const nextNotifficationDt = new Date(date.format().slice(0, -8) + '00').toISOString()

                const event = new Event({
                    name: name,
                    description: description,
                    startDt: startDt,
                    priority: priority,
                    type: type,
                    notificationPeriod: notificationPeriod,
                    info: info,
                    nextNotifficationDt: nextNotifficationDt,
                    target: target
                })
                await event.save()
                socket.emit('addEvent', 'Мероприятие успешно добавлено в систему!')
            } catch (e) {
                socket.emit('addEvent', 'Ошибка!')
            }
        })

        socket.on('deleteEvent', async (eventForDelete) => {
            try {

                await Event.deleteOne({
                    "_id": eventForDelete._id
                })
                socket.emit('deleteEvent', 'Мероприятие успешно удалено')
            } catch (e) {
                socket.emit('deleteEvent', 'Ошибка!')
            }
        })

        socket.on('updateEvent', async (eventForUpdate) => {
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
                    "info": eventForUpdate.info
                })
                socket.emit('updateEvent', 'Мероприятие успешно изменено')
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

                    const admissionYear = await User.findOne({
                        "_id": userId
                    }).admissionYear

                    userEvents = await Event.find({
                        $or: [{
                                "owner": admissionYear
                            },
                            {
                                "owner": userId
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