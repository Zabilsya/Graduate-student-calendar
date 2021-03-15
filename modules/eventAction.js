const moment = require('moment')
const Event = require('./../models/Event')

module.exports = function (socket, eventChangeStream) {

    var socket = socket
    var eventChangeStream = eventChangeStream

    this.subscribeToEvents = function () {

        eventChangeStream.on("change", async (change) => {

            switch (change.operationType) {
                case "insert":
                    // TODO: Преобразовать date к moment. Предварительно увидеть в каком виде mongo возвращает дату.
                    const newEvent = {
                        _id: change.fullDocument._id,
                        name: change.fullDocument.name,
                        description: change.fullDocument.description,
                        startDatetime: change.fullDocument.startDatetime,
                        priority: change.fullDocument.priority,
                        type: change.fullDocument.type,
                        notificationPeriod: change.fullDocument.notificationPeriod,
                        info: change.fullDocument.info,
                        nextNotifficationDatetime: change.fullDocument.lastNotifficationDatetime
                    }

                    socket.emit("newEvent", newEvent);
                    break;

                case "delete":
                    socket.emit("deletedEvent", change.documentKey._id);
                    break;

                case "update":
                    const response = await User.findOne({
                        "_id": change.documentKey._id
                    })
                    // TODO: То же.
                    const updatedUser = {
                        _id: response._id,
                        name: response.name,
                        description: response.description,
                        startDatetime: response.startDatetime,
                        priority: response.priority,
                        type: response.type,
                        notificationPeriod: response.notificationPeriod,
                        info: response.info
                    }

                    socket.emit("updatedEvent", updatedUser)
                    break;

            }
        })

        socket.on('addEvent', async (newEvent) => {
            try {
                const {
                    name,
                    description,
                    startDatetime,
                    priority,
                    type,
                    notificationPeriod,
                    info
                } = newEvent

                var date = moment().utc().add(notificationPeriod, 'days').format('D.M.Y')
                // * Ожидаю startDatetime в UTC !
                var time = startDatetime.format('H:mm')

                const nextNotifficationDatetime = moment(date + " " + time)

                const event = new Event({
                    name: name,
                    description: description,
                    startDatetime: startDatetime,
                    priority: priority,
                    type: type,
                    notificationPeriod: notificationPeriod,
                    info: info,
                    nextNotifficationDatetime: nextNotifficationDatetime
                })
                await event.save()
                socket.emit('addEvent', 'Мероприятие успешно добавлено в систему!')
            } catch (e) {
                socket.emit('addEvent', 'Ошибка!')
            }
        })

        socket.on('deleteEvent', async (eventForDelete) => {
            try {

                await User.deleteOne({
                    "_id": eventForDelete._id
                })
                socket.emit('deleteEvent', 'Событие успешно удалено')
            } catch (e) {
                socket.emit('deleteEvent', 'Ошибка!')
            }
        })

        socket.on('updateEvent', async (eventForUpdate) => {
            try {

                await User.updateOne({
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
    this.getEvent = function () {
        socket.on('getEvents', async () => {
            try {
                const eventsAll = await Event.find()
                socket.emit('getEvents', eventsAll)
            } catch (e) {
                socket.emit('getEvents', 'Ошибка!')
            }
        })
    }
}