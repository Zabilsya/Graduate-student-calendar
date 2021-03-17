const {Schema, model} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    startDt: {type: Date, required: true},
    priority: {type: Number, required: true},
    type: {type: String, required: true},
    notificationPeriod: {type: Number, required: true},
    info: {type: String, required: false},
    nextNotifficationDt: {type: Date, required: true},
    target: {type: String, required: true}    
})

module.exports = model('Event', schema)