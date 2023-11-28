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
        const num = Math.floor(Math.random() * 2001)
        let rarity = 'C'
        if (num == 0) {
            rarity = 'SS'
        } else if (num > 0 && num < 41) {
            rarity = 'S'
        } else if (num > 40 && num < 201) {
            rarity = 'A'
        } else if (num > 200 && num < 601) {
            rarity = 'B'
        }

        let copy = await Card.findOne({user_id, card, rarity})
        let copyIDs = {}
        const origRarity = rarity

        while (copy) {
            copyIDs[copy._id] = 1
            await Card.findOneAndDelete({user_id, card, rarity})
            if (rarity === 'C') {
                rarity = 'B'
            } else if (rarity === 'B') {
                rarity = 'A'
            } else if (rarity === 'A') {
                rarity = 'S'
            }
            copy = await Card.findOne({user_id, card, rarity})
        }
        console.log('rarity', rarity)
        const ccard = await Card.create({card, user_id, rarity})
        res.status(200).json({card: ccard, origRarity, copyIDs})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getCard,
    getCards,
    createCard,
}