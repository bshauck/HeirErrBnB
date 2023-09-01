const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');
const { put } = require('./spots');
const router = require('express').Router();

// Create and return a new image for current user's review by reviewId.
router.post('/:reviewId(\\d+)/images', requireAuth, async (req, res) => {
});

router.route('/:reviewId(\\d+)')
    // Delete an existing review of current user's.
    .delete(requireAuth, async (req, res) => {
    })
    // Update and return an existing review of current user's.
    .put(requireAuth, async (req, res) => {
});

// Returns all reviews written by current user.
router.get('/current', requireAuth, async (req, res) => {
});



module.exports = router;
