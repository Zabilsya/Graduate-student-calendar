const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    startDatetime: {type: Date, required: true},
    priority: {type: Number, required: true},
    type: {type: String, required: true},
    notificationPeriod: {type: Number, required: true},
    info: {type: String, required: false},
    nextNotifficationDatetime: {type: Date, required: true}
})

module.exports = model('Event', schema)