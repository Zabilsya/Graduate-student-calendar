const {Schema, model} = require('mongoose')

const schema = new Schema({
    eventId: {type: Object, required: true, unique: false},
    userId: {type: Object, required: true, unique: false}
})

module.exports = model('EventUser',schema)