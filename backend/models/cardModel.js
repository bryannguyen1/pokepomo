const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cardSchema = new Schema({
    card: {
        type: Object,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    rarity: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)
