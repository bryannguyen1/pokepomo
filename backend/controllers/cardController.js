const Card = require('../models/cardModel')
const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectId;

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

        let copy = await Card.findOne({user_id, 'card.name': card.name, rarity})
        let copyIDs = {}
        const origRarity = rarity
        let level = 1
        let exp = 0
        let copyS = false

        while (copy && rarity !== 'S') {
            copyIDs[copy._id] = 1
            // combine exp of copies
            if (level === 1) {
                level = copy.level
                exp = copy.exp
            } else {
                for (let i = 1; i < copy.level; i++) {
                    if (i * 100 + exp > level * 100) {
                        exp += i * 100 - level * 100
                        level += 1
                    } else {
                        exp += i * 100
                    }
                }
                if (exp + copy.exp > level * 100) {
                    exp += copy.exp - level * 100
                } else {
                    exp += copy.exp
                }
            }
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

        copy = await Card.findOne({user_id, 'card.name': card.name, rarity})
        if (rarity === 'S' && copy) {
            copyS = true
            res.status(200).json({copyS, origRarity})
        } else {
            const ccard = await Card.create({card, user_id, rarity, level, exp})
            res.status(200).json({card: ccard, origRarity, copyIDs, copyS})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

async function updateExp(req, res) {
    const { cardID, exp } = req.body
    console.log(cardID, exp)
    let o_id =  new ObjectId(cardID)
    const card = await Card.findOne(o_id)

    if (!card) {
        return res.status(404).json({error: 'Card does not exist'})
    }

    let ccard = {}
    let update = true
    if (card.exp + exp > card.level * 100) {
        if (card.level < 100) {
            ccard = await Card.findOneAndUpdate(o_id, {$inc: {level: 1}, exp: card.exp + exp - card.level * 100}, {new: true})
        } else {
            update = false
        }
    } else {
        ccard = await Card.findOneAndUpdate(o_id, {$inc: {exp}}, {new: true})
    }
    res.status(200).json({card: ccard, update})
}

module.exports = {
    getCard,
    getCards,
    createCard,
    updateExp
}