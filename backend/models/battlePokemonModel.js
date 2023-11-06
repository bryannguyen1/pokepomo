const mongoose = require('mongoose')

const Schema = mongoose.Schema

const battlePokemonSchema = new Schema({
    card: {
        type: Object,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('BattlePokemon', battlePokemonSchema)
