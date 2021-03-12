const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

const User = require('./models/User')

// Создать БД и реализовать подключение к ней
async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        io.sockets.on('connection', socket => {
            console.log('подкл')
            socket.on('addUser', async (newUser) => {
                try {
                    const{email,name,secondName,thirdName,year} = newUser
                    const randomstring = Math.random().toString(36).slice(-8);
                    console.log(randomstring)
                    const hashedPassword = await bcrypt.hash(randomstring,12)
                    const user = new User (
                        { email: email
                            ,name: name
                            ,secondName: secondName
                            ,thirdName: thirdName
                            ,admissionYear: year
                            ,password: hashedPassword 
                        })
                    await user.save()
                    socket.emit('addUser', 'Аспирант успешно добавлен в систему!')
                }
                catch(e) {
                    socket.emit('addUser', 'Ошибка!')
                }
            })

            // получаем в response id пользователя
            // socket.on('enter', response => {

            // })
            // socket.on('mes', mes => {
            //     console.log(mes)
            //     socket.emit('mes', `${mes} privet client`)
            // })
        })

    }
    catch (e){
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()