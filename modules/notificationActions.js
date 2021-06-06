const moment = require('moment')

require('dotenv').config()

const Event = require('./../models/Event')
const User = require('./../models/User')
const Notification = require('./../models/Notification')

module.exports = function (socket, notificationChangeStream, userId) {

    this.subscribeToNotifications = function () {

        notificationChangeStream.on("change", async (change) => {

            switch (change.operationType) {
                case "insert":

                    const newNotification = {
                        _id: change.documentKey._id,
                        target: change.fullDocument.target,
                        eventId: change.fullDocument.eventId,
                        eventName: change.fullDocument.eventName,
                        createDt: change.fullDocument.createDt,
                        type: change.fullDocument.type,
                        viewers: change.fullDocument.viewers,
                        daysLeft: change.fullDocument.daysLeft
                    }

                    if (userId == newNotification.target) {

                        socket.emit("newNotification", newNotification)

                    } else if (newNotification.target.lenght == 'YYYY'.lenght) {

                        const user = await User.findOne({
                            "_id": userId
                        })

                        const admissionYear = user.admissionYear

                        if (admissionYear == newNotification.target) {
                            socket.emit("newNotification", newNotification)
                        }
                    }
                    break;
                
                case "update":
                    viewedNotification = await Notification.findOne({
                        "_id" : change.documentKey._id
                    })

                    socket.emit('viewNotification', viewedNotification)
                    break;

                case "delete":
                    socket.emit('deletedNotification', change.documentKey._id)
                    break;

            }
        })
    }
    this.getNotifications = function () {

        socket.on('getNotifications', async () => {

            let userNotifications

            try {
            
                if (userId != process.env.superuserId) {

                    const user = await User.findOne({
                        "_id": userId
                    })

                    const admissionYear = user.admissionYear

                    userNotifications = await Notification.find({
                        $or: [{
                            "target": admissionYear
                        },
                        {
                            "target": userId
                        }
                        ]
                    })

                }

                if (!userNotifications) userNotifications = []
                socket.emit('getNotifications', userNotifications)

            } catch (e) {
                socket.emit('getNotifications', 'Ошибка!')
            }
        })

        socket.on('viewNotification', async (notification) => {
            
            try {
                notification.viewers.push(userId)
                await Notification.updateOne({
                    "_id": notification._id
                }, {
                    "viewers": notification.viewers
                })
                            
            } catch (e) {
                console.log('Обновление уведомления произошло с ошибкой')
            }
        })
    }
}
