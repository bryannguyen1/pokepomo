const Credit = require('../models/creditModel')
const mongoose = require('mongoose')

async function getCredits(req, res) {
    const user_id = req.user._id
    const credits = await Credit.find({ user_id }).sort({createdAt: -1})
    // if credits already exists
    if (credits.length > 0) {
        res.status(200).json(credits)
    } 
    else { // if credits does not exist, create credits
        try {
            console.log('hi')
            await Credit.create({credits: 0, user_id})
            findCredits = await Credit.find({ user_id }).sort({createdAt: -1})
            res.status(200).json(findCredits)
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}

async function updateCredits(req, res) {
    const {addCredits} = req.body
    const user_id = req.user._id

    const credits = await Credit.findOneAndUpdate({ user_id }, {$inc: {credits: addCredits}}, {new: true})

    if (!credits) {
        return res.status(404).json({error: 'Credits do not exist'})
    }

    res.status(200).json(credits)
}

module.exports = {
    getCredits,
    updateCredits,
}