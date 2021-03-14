const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    startDatetime: {type: Date, required: true},
    priority: {type: integer, required: true},
    type: {type: String, required: true},
    notificationFrequency: {type: integer, required: true},
    info: {type: String, required: false},
    lastNotifficationDatetime: {type: String, required: true}
})

module.exports = model('Event', schema)