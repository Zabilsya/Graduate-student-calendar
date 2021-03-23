const {
    Schema,
    model
} = require('mongoose')

const schema = new Schema({
    target: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    createDt: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    daysLeft: {
        type: Number,
        required: false
    },
    viewers: [{
        type: String
    }]
})

module.exports = model('Notification', schema)