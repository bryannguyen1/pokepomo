const express = require('express')
const {
    getBP,
    updateBP
} = require('../controllers/battlePokemonController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all credit routes
router.use(requireAuth)

// GET credits
router.get('/', getBP)

// UPDATE credits
router.patch('/', updateBP)

module.exports = router