const User = require('./../models/User')
const config = require('config')
const bcrypt = require('bcryptjs')

const nodemailer = require('nodemailer') 


module.exports = function (socket, userChangeStream, userId) {

    this.subscribeToEvents = function () {

        function sendPassword(generatedPassword,userEmail,name) {
            
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email,
                    pass: config.emailPass
                }
            })

            let mailOptions = {
                from: config.email,
                to: userEmail,
                subject: 'Пароль',
                text: `Ваш пароль: ${generatedPassword}`
            }

            transporter.sendMail(mailOptions, function(err,data){
                if(err){
                    console.log('Ошибка',err)
                }else{
                    console.log('Письмо отправлено')
                }
            })
        }

        userChangeStream.on("change", async (change) => {

            switch (change.operationType) {
                case "insert":
                    const newUser = {
                        _id: change.documentKey._id,
                        email: change.fullDocument.email,
                        name: change.fullDocument.name,
                        secondName: change.fullDocument.secondName,
                        thirdName: change.fullDocument.thirdName,
                        admissionYear: change.fullDocument.admissionYear
                    }

                    if (userId == config.get('superuserId') || userId == newUser._id.toString()) {
                        socket.emit("newUser", newUser);
                    }

                    break;

                case "delete":

                    if (userId == config.get('superuserId')) {

                        socket.emit("deletedUser", change.documentKey._id);
                    }

                    break;

                case "update":

                    const response = await User.findOne({
                        "_id": change.documentKey._id
                    })

                    const updatedUser = {
                        _id: response._id,
                        email: response.email,
                        name: response.name,
                        secondName: response.secondName,
                        thirdName: response.thirdName,
                        admissionYear: response.admissionYear,
                    }

                    if (userId == config.get('superuserId') || userId == updatedUser._id.toString()) {
                        socket.emit("updatedUser", updatedUser)
                    }

                    break;

            }
        })

        socket.on('addUser', async (newUser) => {
            try {
                const {
                    email,
                    name,
                    secondName,
                    thirdName,
                    admissionYear
                } = newUser
                const randomstring = Math.random().toString(36).slice(-8)
                sendPassword(randomstring,email,name)                
                console.log(randomstring)
                const hashedPassword = await bcrypt.hash(randomstring, 12)
                const user = new User({
                    email: email,
                    name: name,
                    secondName: secondName,
                    thirdName: thirdName,
                    admissionYear: admissionYear,
                    password: hashedPassword
                })
                await user.save()

                socket.emit('addUser', 'Аспирант успешно добавлен в систему!')
            } catch (e) {
                socket.emit('addUser', 'Ошибка!')
            }
        })


        socket.on('deleteUser', async (userForDelete) => {

            try {
                await User.deleteOne({
                    "_id": userForDelete._id
                })
                socket.emit('deleteUser', 'Аспирант успешно удален')
            } catch (e) {
                socket.emit('deleteUser', 'Ошибка!')
            }
        })


        socket.on('updateUser', async (userForUpdate) => {

            const current = await User.findOne({
                "_id": userForUpdate._id
            })

            if (current.email == userForUpdate.email &&
                current.name == userForUpdate.name &&
                current.secondName == userForUpdate.secondName &&
                current.thirdName == userForUpdate.thirdName &&
                current.admissionYear == userForUpdate.admissionYear) {
                socket.emit('updateUser', 'Вы не внесли никаких изменений')
                return
            }

            try {
                await User.updateOne({
                    "_id": userForUpdate._id
                }, {
                    "email": userForUpdate.email,
                    "name": userForUpdate.name,
                    "secondName": userForUpdate.secondName,
                    "thirdName": userForUpdate.thirdName,
                    "admissionYear": userForUpdate.admissionYear
                })
                socket.emit('updateUser', 'Данные успешно изменены')
            } catch (e) {
                socket.emit('updateUser', 'Ошибка!')
            }
        })
    }

    this.getUser = function () {

        if (userId == config.get('superuserId')) {

            socket.on('getUsers', async () => {
                try {
                    const usersAll = await User.find()
                    socket.emit('getUsers', usersAll)
                } catch (e) {
                    socket.emit('getUsers', 'Ошибка!')
                }
            })

        } else {
            socket.on('getUsers', async () => {
                try {
                    const usersAll = await User.findOne({
                        "_id": userId
                    })
                    socket.emit('getUsers', [usersAll])
                } catch (e) {
                    socket.emit('getUsers', 'Ошибка!')
                }
            })
        }

    }

}