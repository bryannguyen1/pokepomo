const Card = require('../models/cardModel')
const mongoose = require('mongoose')

async function getCard(req, res) {
    const user_id = req.user._id
    const { name } = req.params

    const card = await Card.findOne({user_id, 'card.name': name})

    if (!card) {
        return res.status(404).json({error: 'No such card'})
    }

    res.status(200).json(card)
}

async function getCards(req, res) {
    const user_id = req.user._id

    const cards = await Card.find({ user_id }).sort({createdAt: -1})

    res.status(200).json(cards)
}

async function createCard(req, res) {
    const {card} = req.body

    try {
        const user_id = req.user._id
        const ccard = await Card.create({card, user_id})
        res.status(200).json(ccard)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getCard,
    getCards,
    createCard,
}