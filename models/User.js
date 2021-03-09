const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    secondName: {type: String, required: true},
    thirdName: {type: String, required: false},
    admissionYear: {type: Number, required: true}
})

module.exports = model('User',schema)