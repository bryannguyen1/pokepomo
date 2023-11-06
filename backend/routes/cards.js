const express = require('express')
const {
    getCard,
    getCards,
    createCard
} = require('../controllers/cardController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all card routes
router.use(requireAuth)

// GET one card
router.get('/:name', getCard)

// GET all cards
router.get('/', getCards)

// POST a new card
router.post('/', createCard)

module.exports = router