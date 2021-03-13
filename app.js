const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.json({
    extended: true
}))
app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

const User = require('./models/User')
const {
    db
} = require('./models/User')

// Создать БД и реализовать подключение к ней
async function start() {
    try {
        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        await mongoose.createConnection(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Подключение успешно!')
        const userChangeStream = User.watch();
        io.sockets.on('connection', socket => {



            //#region subscribeToChanges
            userChangeStream.on("change", (change) => {
                let user;

                switch (change.operationType) {
                    case "insert":

                        user = {
                            _id: change.fullDocument._id,
                            email: change.fullDocument.email,
                            name: change.fullDocument.name,
                            secondName: change.fullDocument.secondName,
                            thirdName: change.fullDocument.thirdName,
                            admissionYear: change.fullDocument.admissionYear,
                            password: change.fullDocument.password
                        }

                        socket.emit("newUser", user);
                        break;

                    case "delete":
                        socket.emit("deletedUser", change.documentKey._id);
                        break;

                    case "update":

                        user = {
                            _id: change.fullDocument._id,
                            email: change.fullDocument.email,
                            name: change.fullDocument.name,
                            secondName: change.fullDocument.secondName,
                            thirdName: change.fullDocument.thirdName,
                            admissionYear: change.fullDocument.admissionYear,
                            password: change.fullDocument.password
                        }

                        socket.emit("updatedUser", user)
                        break;

                }
            })
            //#endregion

            ///#region addEditDeleteUser
            socket.on('addUser', async (newUser) => {
                try {
                    const {
                        email,
                        name,
                        secondName,
                        thirdName,
                        year
                    } = newUser
                    const randomstring = Math.random().toString(36).slice(-8);
                    console.log(randomstring)
                    const hashedPassword = await bcrypt.hash(randomstring, 12)
                    const user = new User({
                        email: email,
                        name: name,
                        secondName: secondName,
                        thirdName: thirdName,
                        admissionYear: year,
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
                        "email": userForDelete.email
                    })
                    socket.emit('deleteUser', 'Аспирант успешно удален')
                } catch (e) {
                    socket.emit('deleteUser', 'Ошибка!')
                }
            })


            socket.on('updateUser', async (userForUpdate) => {
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
                    socket.emit('updateUser', 'Аспирант успешно изменен')
                } catch (e) {
                    socket.emit('updateUser', 'Ошибка!')
                }
            })

            //#endregion addEditDeleteUser


            //#region getUser

            socket.on('getUsers', async () => {
                try {
                    const usersAll = await User.find()
                    socket.emit('getUser', usersAll)

                } catch (e) {
                    socket.emit('getUser', 'Ошибка!')
                }
            })

            //#endregion getUser


        })
    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()