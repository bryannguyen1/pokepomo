const express = require('express')
const {
    getCredits,
    updateCredits
} = require('../controllers/creditController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all credit routes
router.use(requireAuth)

// GET credits
router.get('/', getCredits)

// UPDATE credits
router.patch('/', updateCredits)

module.exports = router