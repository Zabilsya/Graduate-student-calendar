const moment = require('moment')

const config = require('config')

const Event = require('./../models/Event')
const User = require('./../models/User')
const Notification = require('./../models/Notification')




module.exports = function (socket, eventChangeStream, userId) {

    // userId - id юзера, который прямо сейчас зашел на сайт

    this.subscribeToNotifications = function () {

        eventChangeStream.on("change", async (change) => {

            switch (change.operationType) {
                case "insert":

                    const newNotification = {
                        _id: change.fullDocument._id,
                        target: change.fullDocument.target,
                        eventId: change.fullDocument.eventId,
                        eventName: change.fullDocument.eventName,
                        createDt: change.fullDocument.createDt,
                        type: change.fullDocument.type,
                        daysLeft: change.fullDocument.daysLeft
                    }

                    if (userId == newNotification.target) {

                        socket.emit("newNotification", newNotification)

                    } else if (newEvent.target.lenght == 'YYYY'.length) {

                        const admissionYear = await User.findOne({
                            "_id": userId
                        }).admissionYear

                        if (admissionYear == newNotification.target) {
                            socket.emit("newNotification", newNotification)
                        }
                    }
                    break;
            }
        })
    }
    this.getNotifications = function () {

        socket.on('getNotifications', async () => {

            let userNotifications

            try {

                if (userId != config.get('superuserId')) {

                    const admissionYear = await User.findOne({
                        "_id": userId
                    }).admissionYear


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
                socket.emit('getNotifications', userNotifications)

            } catch (e) {
                socket.emit('getNotifications', 'Ошибка!')
            }
        })
    }


}
