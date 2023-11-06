const mongoose = require('mongoose')

const Schema = mongoose.Schema

const creditSchema = new Schema({
    credits: {
        type: Number,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Credit', creditSchema)
