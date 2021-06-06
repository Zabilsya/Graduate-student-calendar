const User = require('./../models/User')
const config = require('config')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')

const nodemailer = require('nodemailer') 

module.exports = function (socket, userChangeStream, userId) {

    function validateUser(operationType,email,name,secondName,direction,admissionYear){    
        console.log(direction)
        let flag = true

        const incorrectEmailText = 'Некорректный email'
        check('email', incorrectEmailText).normalizeEmail().isEmail()
        const errorEmail = validationResult({email})

        if (!errorEmail.isEmpty()){
            socket.emit(operationType, incorrectEmailText)
            flag = false
        }
        if (name.length < 1){
            socket.emit(operationType, 'Некорректное имя')
            flag = false
        }
        if (secondName.length < 1){
            socket.emit(operationType, 'Некорректная фамилия')
            flag = false
        }
        if (direction.length < 1) {
            socket.emit(operationType, 'Некорректная специальность')
            flag = false
        }
        if (+admissionYear < 2020 || +admissionYear > new Date().getFullYear() + 1){
            socket.emit(operationType, 'Некорректный год')
            flag = false
        }
        return flag
    }

    this.subscribeToEvents = function () {
        
        function sendPassword(generatedPassword,userEmail,name) {
            
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
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
                if (err) {
                    console.log('Ошибка', err)
                } else {
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
                        direction: change.fullDocument.direction,
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
                        direction: response.direction,
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
                    direction,
                    admissionYear
                } = newUser

                if(validateUser('addUser',email,name,secondName,direction,admissionYear))
                {
                    const randomstring = Math.random().toString(36).slice(-8)
                    sendPassword(randomstring,email,name)                
                    console.log(randomstring)
                    const hashedPassword = await bcrypt.hash(randomstring, 12)
                    const user = new User({
                        email: email,
                        name: name,
                        secondName: secondName,
                        thirdName: thirdName,
                        direction: direction,
                        admissionYear: admissionYear,
                        password: hashedPassword
                    })
                    await user.save()
    
                    socket.emit('addUser', 'Аспирант успешно добавлен в систему!')
                }
                
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

            let newPassword
            const passwordWithoutSpaces = userForUpdate.password.replace(/\s/g, '')

            if (userForUpdate.password.length > 0 && !passwordWithoutSpaces) {
                socket.emit('updateUser', 'Вы ввели некорректный пароль!')
                return
            }

            
            if (passwordWithoutSpaces && passwordWithoutSpaces.length < 6) {
                socket.emit('updateUser', 'Длина пароля должна быть не менее 6 символов!')
                return
            }

            if (passwordWithoutSpaces) {
                newPassword = await bcrypt.hash(userForUpdate.password, 12)
            } else {
                newPassword = current.password
            }

            if (current.email == userForUpdate.email &&
                current.name == userForUpdate.name &&
                current.secondName == userForUpdate.secondName &&
                current.thirdName == userForUpdate.thirdName &&
                current.direction == userForUpdate.direction &&
                current.admissionYear == userForUpdate.admissionYear &&
                current.password == newPassword) {
                socket.emit('updateUser', 'Вы не внесли никаких изменений')
                return
            }

            try {

                if(validateUser('updateUser',userForUpdate.email,userForUpdate.name,userForUpdate.secondName,userForUpdate.direction,userForUpdate.admissionYear)){
                
                    await User.updateOne({
                        "_id": userForUpdate._id
                    }, {
                        "email": userForUpdate.email,
                        "name": userForUpdate.name,
                        "secondName": userForUpdate.secondName,
                        "thirdName": userForUpdate.thirdName,
                        "direction": userForUpdate.direction,
                        "admissionYear": userForUpdate.admissionYear,
                        "password": newPassword
                    })
                    socket.emit('updateUser', 'Данные успешно изменены')
                
                }
              
            }catch (e) {
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