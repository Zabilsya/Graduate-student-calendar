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
                        startDatetime: change.fullDocument.startDatetime,
                        priority: change.fullDocument.priority,
                        type: change.fullDocument.type,
                        notificationPeriod: change.fullDocument.notificationPeriod,
                        info: change.fullDocument.info,
                        nextNotifficationDatetime: change.fullDocument.lastNotifficationDatetime,
                        owner: change.fullDocument.owner
                    }

                    if (userId == config.get('superuserId') || (userId == newEvent.owner)) {

                        socket.emit("newEvent", newEvent)

                    } else if (newEvent.owner.lenght == 'YYYY'.length) {

                        const admissionYear = await User.findOne({
                            "_id": userId
                        }).admissionYear

                        if (admissionYear == newEvent.owner) {
                            socket.emit("newEvent", newEvent)
                        }
                    }


                    break;

                case "delete":

                    const response = await Event.findOne({
                        "_id": change.documentKey._id
                    })

                    if (userId == config.get('superuserId') || (userId == response.owner)) {

                        socket.emit("deletedEvent", response.documentKey._id)

                    } else if (response.owner.lenght == 'YYYY'.length) {

                        const admissionYear = await User.findOne({
                            "_id": userId
                        }).admissionYear

                        if (admissionYear == response.owner) {
                            socket.emit("deletedEvent", response)
                        }
                    }
                    socket.emit("deletedEvent", change.documentKey._id);
                    break;


                case "update":

                    const response = await Event.findOne({
                        "_id": change.documentKey._id
                    })

                    const updatedEvent = {
                        _id: response._id,
                        name: response.name,
                        description: response.description,
                        startDatetime: response.startDatetime,
                        priority: response.priority,
                        type: response.type,
                        notificationPeriod: response.notificationPeriod,
                        info: response.info
                    }
                    if (userId == config.get('superuserId') || (userId == response.owner)) {

                        socket.emit("updatedEvent", updatedEvent)

                    } else if (response.owner.lenght == 'YYYY'.length) {

                        const admissionYear = await User.findOne({
                            "_id": userId
                        }).admissionYear

                        if (admissionYear == response.owner) {
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
                    startDatetime,
                    priority,
                    type,
                    notificationPeriod,
                    info
                } = newEvent
                priority = 2
                type = 'huy'
                notificationPeriod = 2

                const momentTime = moment(startDatetime)
                startDatetime = new Date(momentTime.format().slice(0, -8) + '00').toISOString()

                const date = momentTime.add(notificationPeriod, 'days')

                const nextNotifficationDatetime = new Date(date.format().slice(0, -8) + '00').toISOString()

                const event = new Event({
                    name: name,
                    description: description,
                    startDatetime: startDatetime,
                    priority: priority,
                    type: type,
                    notificationPeriod: notificationPeriod,
                    info: info,
                    nextNotifficationDatetime: nextNotifficationDatetime,
                    owner: owner
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
                socket.emit('deleteEvent', 'Событие успешно удалено')
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
                    "startDatetime": eventForUpdate.startDatetime,
                    "priority": eventForUpdate.priority,
                    "type": eventForUpdate.type,
                    "notificationPeriod": eventForUpdate.notificationPeriod,
                    "info": eventForUpdate.info
                })
                socket.emit('updateEvent', 'Аспирант успешно изменен')
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