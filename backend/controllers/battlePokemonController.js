const BattlePokemon = require('../models/battlePokemonModel')
const mongoose = require('mongoose')

async function getBP(req, res) {
    const user_id = req.user._id

    const bp = await BattlePokemon.find({ user_id }).sort({createdAt: -1})

    if (bp.length > 0) {
        res.status(200).json(bp)
    } else {
        try {
            await BattlePokemon.create({card: {name: 'N/A'}, user_id, card_id: 'dummy'})
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}

async function updateBP(req, res) {
    const {card, card_id} = req.body
    const user_id = req.user._id

    const bp = await BattlePokemon.findOneAndUpdate({ user_id }, { card, card_id }, {new: true})

    if (!bp) {
        return res.status(404).json({error: error.message})
    }

    res.status(200).json(bp)
}

module.exports = {
    getBP,
    updateBP,
}