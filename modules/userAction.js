const User = require('./../models/User')

module.exports = function(socket,userChangeStream){

    var socket = socket
    var userChangeStream = userChangeStream


    this.subscribeToEvents = function() {

        userChangeStream.on("change", async (change) => {

            switch (change.operationType) {
                case "insert":

                    const newUser = {
                        _id: change.fullDocument._id,
                        email: change.fullDocument.email,
                        name: change.fullDocument.name,
                        secondName: change.fullDocument.secondName,
                        thirdName: change.fullDocument.thirdName,
                        admissionYear: change.fullDocument.admissionYear,
                    }

                    socket.emit("newUser", newUser);
                    break;

                case "delete":
                    socket.emit("deletedUser", change.documentKey._id);
                    break;

                case "update":     
                    const respone = await User.findOne({
                        "_id": change.documentKey._id
                    })

                    const updatedUser = {
                        _id: respone._id,
                        email: respone.email,
                        name: respone.name,
                        secondName: respone.secondName,
                        thirdName: respone.thirdName,
                        admissionYear: respone.admissionYear,
                    }
                   
                    socket.emit("updatedUser", updatedUser)
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
                const randomstring = Math.random().toString(36).slice(-8);
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
    }

    this.getUser = function(){

        socket.on('getUsers', async () => {
            try {
                const usersAll = await User.find()
                socket.emit('getUsers', usersAll)
            } catch (e) {
                socket.emit('getUsers', 'Ошибка!')
            }
        })
    }

}